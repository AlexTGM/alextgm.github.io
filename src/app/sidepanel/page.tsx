'use server'

import { cookies } from "next/headers";

import ClientPage from "@/app/sidepanel/client-page";
import { SignOut } from "@/app/sidepanel/sign-out";

export default async function Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("google_jwt");

  if (!cookie?.value) {
    return <div>Unauthorized</div>;
  }

  const response = await (
    await fetch(
      "https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions",
      {
        headers: { "Google-Id-Token": cookie?.value },
      },
    )
  ).json();

  return (
    <div>
      <pre>{JSON.stringify(response, null, 2)}</pre>

      <SignOut />

      <ClientPage />
    </div>
  );
}
