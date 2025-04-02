import "./globals.css";
import GoogleOneTap from "@/app/components/google-one-tap";
import { PropsWithChildren } from "react";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  console.log(process.env.AUTH_GOOGLE_ID)

  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        <GoogleOneTap user={session?.user} />
      </body>
    </html>
  );
}
