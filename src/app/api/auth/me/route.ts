import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jwt = req.cookies.get("google_jwt")?.value;

  if (!jwt) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ jwt });
}
