"use client";

// import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import Home from "@/app/sidepanel/new";

// const NoSSR = dynamic(() => import("./client-page"), { ssr: false });

export default function Page() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
