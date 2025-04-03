import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  // Set an HTTP-only cookie
  const cookie = serialize("google_jwt", token, {
    httpOnly: true, // Cannot be accessed via JavaScript
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    // sameSite: "Strict", // Prevent CSRF attacks
    path: "/", // Available across the site
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return new NextResponse("JWT Stored", {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
