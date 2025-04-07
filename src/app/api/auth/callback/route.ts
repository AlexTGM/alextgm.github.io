import { OAuth2Client } from "google-auth-library";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// api/auth/callback
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  const redirectUrl = new URL(req.url).searchParams.get("state")!;
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Missing authorization code" }),
      { status: 400 },
    );
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.access_token) {
      cookieStore.set("access_token", tokens.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(tokens.expiry_date ?? ""),
        path: "/",
      });
    }

    return Response.redirect(redirectUrl);
  } catch (error) {
    console.error("Error while handling Google callback", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve tokens", payload: error }),
      {
        status: 500,
      },
    );
  }
}
