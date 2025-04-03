"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";
import { signOut, useSession } from "next-auth/react";

export default function ClientPage() {
  const session = useSession();

  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();

  // const onSignIn = (response: { credential: string }) => {
  //   console.log("Encoded JWT ID token:", response);
  //
  //   fetch("https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions", {
  //     headers: { "Google-Id-Token": response.credential },
  //   })
  // };

  // useEffect(() => {
  //   // Attach the onSignIn function to the global window object (required for Google Sign-In)
  //   (window as unknown as Record<string, unknown>).onSignIn = onSignIn;
  // }, []);

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

  if (session.data) {
    return (
      <div>
        You are logged in{" "}
        <pre>{JSON.stringify(session.data.user, null, 2)}</pre>
        <button onClick={startActivity}>Launch Activity in Main Stage.</button>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else
    return (
      <div>
        You are not logged in
        <button onClick={() => window.location.reload()}>Reload page</button>
      </div>
    );
}
