"use client";

import Script from "next/script";

export default function GoogleOneTap() {
  const initializeGoogleOneTap = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!,
        callback: async (response: { credential: string }) => {
          await fetch("/api/auth/google-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: response.credential }),
            credentials: "include", // Ensures cookies are sent
          });

          window.location.reload()
        },
      });

      window.google.accounts.id.prompt();
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      async
      defer
      onLoad={() => initializeGoogleOneTap()}
      strategy="afterInteractive"
    />
  );
}
