"use server";

import { cookies } from "next/headers";

export async function getSessions() {
  const jwt = (await cookies()).get("google_jwt")?.value;

  const response = await fetch(
    "https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions",
    {
      headers: { "Google-Id-Token": jwt } as unknown as HeadersInit,
    },
  );

  return await response.json() as { sessions: string[] };
}
