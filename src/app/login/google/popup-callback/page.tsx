"use client";

import { useEffect } from "react";

export default function PopupCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { status: "authenticated" },
        window.location.origin,
      );
      window.close();
    }
  }, []);

  return <div>Logging you in...</div>;
}
