"use client";

import { useEffect, useRef, useState } from "react";

const GoogleSignInButton = () => {
  const popupRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);

    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    popupRef.current = window.open(
      `/api/auth/signin?redirect_url=${process.env.NEXT_PUBLIC_AUTH_FINISHED_URI}`,
      "Google OAuth",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popupRef.current) {
      alert("Popup blocked! Please disable popup blockers to proceed.");
      setIsLoading(false);
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (popupRef.current!.closed) {
        clearInterval(checkPopupClosed);
        setIsLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    const abortController = new AbortController();

    window.addEventListener(
      "message",
      (event) => {
        if (event.data === "auth-finished") {
          popupRef.current!.close();
          window.location.reload();
        }
      },
      abortController,
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignInButton;
