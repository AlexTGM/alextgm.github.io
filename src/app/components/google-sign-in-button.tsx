"use client";

import { useState } from "react";

interface GoogleSignInButtonProps {
  onSignIn?: () => void;
}

const GoogleSignInButton = ({ onSignIn }: GoogleSignInButtonProps) => {
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

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin === process.env.NEXT_PUBLIC_GOOGLE_BASE_URL) {
        const tokens = event.data;

        setIsLoading(false);

        console.log("Received tokens:", tokens);

        // Store tokens in localStorage instead of cookies
        try {

          await fetch("/api/auth/store-tokens", {
            method: "POST",
            body: JSON.stringify({ tokens }),
          })

          // Call the onSignIn callback if provided
          if (onSignIn) {
            onSignIn();
          }
        } catch (error) {
          console.error("Error storing tokens:", error);
        }

        // Remove the event listener after handling the message
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

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
