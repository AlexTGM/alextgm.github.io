"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";
import { getSessions } from "./get-sessions";

export default function ClientPage() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [sessions, setSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Launches the main stage when the main button is clicked.
  async function startActivity() {
    if (!sidePanelClient) {
      throw new Error("Side Panel is not yet initialized!");
    }
    await sidePanelClient.startActivity({
      mainStageUrl: MAIN_STAGE_URL,
    });
  }

  // Fetches sessions from the API
  async function fetchSessions() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data.sessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to fetch sessions. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchSessions} disabled={isLoading}>
          {isLoading ? "Loading Sessions..." : "Fetch Sessions"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {sessions && (
          <div style={{ marginTop: "10px" }}>
            <h2>Sessions ({sessions.length}):</h2>
            <ul>
              {sessions.map((session, index) => (
                <li key={index}>{session}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
