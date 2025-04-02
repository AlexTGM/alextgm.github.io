"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { User } from "next-auth";

export default function GoogleOneTap({ user }: { user: User | undefined }) {
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  const handleLogin = async (credential: string) => {
    const url = "/login/google";
    const title = "Sign in with Google";
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const newWindow = window.open(
      `${url}?credential=${credential}`,
      title,
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    newWindow?.focus();
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.status === "authenticated") {
        console.log("Message received:", event);
        // window.location.reload();
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      handleLogin(response.credential);

      // signIn("google", {
      //   credential: response.credential,
      //   redirect: true,
      // }).catch((error) => {
      //   console.error("Error signing in:", error);
      // });
    },
    [],
  );

  const initializeGoogleOneTap = useCallback(() => {
    if (window.google && !user) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!,
          callback: handleCredentialResponse,
          context: "signin",
          ux_mode: "popup",
          auto_select: false,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log(
              "One Tap was not displayed:",
              notification.getNotDisplayedReason(),
            );
          } else if (notification.isSkippedMoment()) {
            console.log(
              "One Tap was skipped:",
              notification.getSkippedReason(),
            );
          } else if (notification.isDismissedMoment()) {
            console.log(
              "One Tap was dismissed:",
              notification.getDismissedReason(),
            );
          }
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "Only one navigator.credentials.get request may be outstanding at one time",
          )
        ) {
          console.log(
            "FedCM request already in progress. Waiting before retrying...",
          );
          setTimeout(initializeGoogleOneTap, 1000);
        } else {
          console.error("Error initializing Google One Tap:", error);
        }
      }
    }
  }, [user, handleCredentialResponse]);

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleOneTap();
    }
  }, [isGoogleScriptLoaded, initializeGoogleOneTap]);

  useEffect(() => {
    if (user) {
      // If user is signed in, cancel any ongoing One Tap prompts
      window.google?.accounts.id.cancel();
    }
  }, [user]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      async
      defer
      onLoad={() => setIsGoogleScriptLoaded(true)}
      strategy="afterInteractive"
    />
  );
}
