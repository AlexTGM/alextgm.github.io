"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";

export default function ClientPage() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();

  const onSignIn = (response: { credential: string }) => {
    console.log("Encoded JWT ID token:", response);
  };

  useEffect(() => {
    // Attach the onSignIn function to the global window object (required for Google Sign-In)
    (window as unknown as Record<string, unknown>).onSignIn = onSignIn;
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
      <script src="https://accounts.google.com/gsi/client" async defer></script>

      <div
        id="g_id_onload"
        data-client_id="918254786145-n465du05i4ds04e3q0oluakjmsp27usr.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onSignIn"
        data-itp_support="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_blue"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>

      <div>This is the add-on Side Panel. Only you can see this. a button</div>
      <button onClick={startActivity}>Launch Activity in Main Stage.</button>
    </>
  );
}
