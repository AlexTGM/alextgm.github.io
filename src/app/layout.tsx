import "./globals.css";
import GoogleOneTap from "@/app/components/google-one-tap";
import { PropsWithChildren } from "react";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleOneTap />
      </body>
    </html>
  );
}
