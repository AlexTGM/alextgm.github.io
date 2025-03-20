import { SessionProvider } from "next-auth/react";
import ClientPage from "@/app/sidepanel/client-page";

export default function Page() {
  return (
    <SessionProvider>
      <ClientPage />
    </SessionProvider>
  );
}
