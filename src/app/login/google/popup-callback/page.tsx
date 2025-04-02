"use client";

import { useEffect } from "react";
import {useSearchParams} from "next/navigation";

export default function PopupCallback() {
  const params = useSearchParams()

  useEffect(() => {
    if (window.opener) {
      alert(JSON.stringify(params, null, 2));

      window.opener.postMessage(
        { status: "authenticated" },
        window.location.origin,
      );
      window.close();
    }
  }, []);

  return <div>Logging you in...</div>;
}
