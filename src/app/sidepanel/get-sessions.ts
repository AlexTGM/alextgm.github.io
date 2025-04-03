"use server";

export async function getSessions() {
  const response = await fetch(
    "https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions",
  );

  return (await response.json()) as { sessions: string[] };
}
