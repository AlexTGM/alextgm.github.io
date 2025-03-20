import NextAuth from "next-auth";
import "next-auth/jwt";

import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    Google({
      authorization: {
        params: { prompt: "consent", access_type: "offline" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // authorized({ auth }) {
    //   return !!auth;
    // },
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (token.expires_at && Date.now() < token.expires_at * 1000) {
        return token;
      } else {
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");

        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token!,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            refresh_token: newTokens.refresh_token
              ? newTokens.refresh_token
              : token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access_token", error);
          return {
            ...token,
            error: "RefreshTokenError",
          };
        }
      }
    },
    async session({ session, token }) {
      if (token?.access_token) session.accessToken = token.access_token;

      session.error = token.error;

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}
