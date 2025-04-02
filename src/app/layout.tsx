import "./globals.css";
import GoogleOneTap from "@/app/components/google-one-tap";
import { PropsWithChildren } from "react";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}

          <GoogleOneTap user={session?.user} />
        </SessionProvider>
      </body>
    </html>
  );
}
