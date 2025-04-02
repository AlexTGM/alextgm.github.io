"use client";

import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Script from "next/script";
import { User } from "next-auth";

export default function GoogleOneTap({ user }: { user: User | undefined }) {
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      signIn("google", {
        credential: response.credential,
        redirect: false,
      }).catch((error) => {
        console.error("Error signing in:", error);
      });
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
