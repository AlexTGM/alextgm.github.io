"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";
import AuthButton from "@/app/components/auth";
import {useSession} from "next-auth/react";

export default function ClientPage() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();

  const session = useSession()

  useEffect(() => {
    console.log(session)
  }, [session]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "AUTH_SUCCESS") {
        const token = event.data.token;
        sessionStorage.setItem("meet-addon-token", token);
        console.log("Received token:", token);
      }
    });
  }, []);

  // Launches the main stage when the main button is clicked.
  async function startActivity() {
    if (!sidePanelClient) {
      throw new Error("Side Panel is not yet initialized!");
    }
    await sidePanelClient.startActivity({
      mainStageUrl: MAIN_STAGE_URL,
    });
  }

  /**
   * Prepares the add-on Side Panel Client.
   */
  useEffect(() => {
    (async () => {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });

      setSidePanelClient(await session.createSidePanelClient());
    })();
  }, []);

  return (
    <>
      <AuthButton />

      <div>This is the add-on Side Panel. Only you can see this.</div>
      <button onClick={startActivity}>Launch Activity in Main Stage.</button>
    </>
  );
}
