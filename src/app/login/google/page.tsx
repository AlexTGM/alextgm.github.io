"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const credential = searchParams.get("credential");

  useEffect(() => {
    signIn(
      "google",
      {
        credential,
        // redirect: false,
        redirectTo: "/login/google/popup-callback",
      },
      {},
    ).catch((error) => {
      console.error("Error signing in:", error);
    });

    // signIn("google", { redirectTo: "/login/google/popup-callback" });
  }, [credential]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        background: "white",
      }}
    ></div>
  );
};

export default SignInPage;
