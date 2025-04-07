"use client";

import { useEffect } from "react";
import { meet } from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER } from "@/constants";

export default function ClientPage() {
  /**
   * Prepares the add-on Side Panel Client.
   */
  useEffect(() => {
    (async () => {
      await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
    })();
  }, []);

  return <div>Side Activity!</div>;
}
