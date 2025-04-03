import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { tokens } = await req.json();

    if (!tokens) {
      return NextResponse.json(
        { error: "No tokens provided" },
        { status: 400 }
      );
    }

    // Store tokens in cookies
    const cookieStore = await cookies();

    // Set access token with appropriate expiry
    if (tokens.access_token) {
      cookieStore.set({
        name: "access_token",
        value: tokens.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // Set expiry based on token expiry or default to 1 hour
        maxAge: tokens.expiry_date ? 
          Math.floor((tokens.expiry_date - Date.now()) / 1000) : 
          3600
      });
    }

    // Set refresh token with longer expiry
    if (tokens.refresh_token) {
      cookieStore.set({
        name: "refresh_token",
        value: tokens.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // Refresh tokens typically have a longer lifespan
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    // Store ID token for email extraction
    if (tokens.id_token) {
      cookieStore.set({
        name: "id_token",
        value: tokens.id_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // ID tokens typically have the same expiry as access tokens
        maxAge: tokens.expiry_date ? 
          Math.floor((tokens.expiry_date - Date.now()) / 1000) : 
          3600
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing tokens:", error);
    return NextResponse.json(
      { error: "Failed to store tokens" },
      { status: 500 }
    );
  }
}
