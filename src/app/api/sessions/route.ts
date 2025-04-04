import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function GET(req: NextRequest) {
  // Get tokens from headers
  const accessToken = req.headers.get("X-Auth-Request-Access-Token");
  const idToken = req.headers.get("X-Auth-Request-ID-Token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized: No access token provided" },
      { status: 401 }
    );
  }

  const headers: HeadersInit = {
    "X-Auth-Request-Access-Token": accessToken,
  };

  // Extract email from ID token if available
  if (idToken) {
    try {
      const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (payload && payload.email) {
        headers["X-Auth-Request-Email"] = payload.email;
      }
    } catch (error) {
      console.error("Error verifying ID token:", error);
    }
  }

  try {
    const response = await fetch(
      "https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions",
      {
        headers,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch sessions: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}