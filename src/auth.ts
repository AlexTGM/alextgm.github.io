import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: true,

    logger: {
        error(code, ...message) {
            console.error(code, message)
        },
        warn(code, ...message) {
            console.warn(code, message)
        },
        debug(code, ...message) {
            console.debug(code, message)
        },
    },

    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    console.log("user:", user, "\naccount:", account);
                    return true;
                } catch (error) {
                    console.error("Error during OAuth login:", error);
                    return false;
                }
            }
            return true;
        },
    },

    secret: 'NWzRMz32dJqeH9qwGXmL8G2VqW9O3hN/4BxkUa3l3vA=',
})