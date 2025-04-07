"use server";

import GoogleSignInButton from "@/app/components/google-sign-in-button";
import ClientPage from "@/app/sidepanel/client-page";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  return (
    <div>
      <pre>access token: {accessToken ?? 'none'}</pre>

      <ClientPage />
      <GoogleSignInButton />
    </div>
  );
}
