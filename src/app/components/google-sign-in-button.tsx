"use client";

import { useState } from "react";

const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);

    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      `/api/auth/signin`,
      "Google OAuth",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    window.addEventListener("message", async (event) => {
      if (event.origin === process.env.NEXT_PUBLIC_GOOGLE_BASE_URL) {
        const tokens = event.data;

        setIsLoading(false);

        console.log("Received tokens:", tokens);

        // Store tokens in middleware via API
        try {
          const response = await fetch("/api/auth/store-tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokens }),
          });

          if (!response.ok) {
            console.error("Failed to store tokens:", await response.text());
          }
        } catch (error) {
          console.error("Error storing tokens:", error);
        }
      }
    });

    if (!popup) {
      alert("Popup blocked! Please disable popup blockers to proceed.");
      setIsLoading(false);
      return;
    }
  };

  return (
    <button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignInButton;
