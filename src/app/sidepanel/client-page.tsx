"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";

export default function ClientPage() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();

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
    <div>
      <h1>User Data</h1>
      <button onClick={startActivity}>Launch Activity in Main Stage.</button>
    </div>
  );

  // if (session.data) {
  //   return (
  //     <div>
  //       You are logged in{" "}
  //       <pre>{JSON.stringify(session.data.user, null, 2)}</pre>
  //       <button onClick={startActivity}>Launch Activity in Main Stage.</button>
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </div>
  //   );
  // } else
  //   return (
  //     <div>
  //       You are not logged in
  //       <button onClick={() => window.location.reload()}>Reload page</button>
  //     </div>
  //   );
}
