import { OAuth2Client } from "google-auth-library";

import { NextRequest, NextResponse } from "next/server";

// api/auth/signin?redirect_url={redirect_url}
export async function GET(req: NextRequest): Promise<NextResponse> {
  const redirectUrl = new URL(req.url).searchParams.get("redirect_url");

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    response_type: "code",
    state: redirectUrl ?? process.env.NEXT_PUBLIC_GOOGLE_BASE_URL!,
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  return NextResponse.redirect(authUrl);
}
