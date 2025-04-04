"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "@/constants";
import { authenticatedFetch, hasValidTokens, clearTokens } from "@/utils/token-storage";
import dynamic from "next/dynamic";

// Dynamically import the GoogleSignInButton component with no SSR
const GoogleSignInButton = dynamic(
  () => import("@/app/components/google-sign-in-button"),
  { ssr: false }
);

export default function ClientPage() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [sessions, setSessions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError("You need to sign in first.");
      setIsLoading(false);
      return;
    }

    try {
      // Use authenticatedFetch to include tokens in the request
      const response = await authenticatedFetch('/api/sessions');

      if (!response.ok) {
        // If we get a 401 Unauthorized, the token might be invalid or expired
        if (response.status === 401) {
          clearTokens();
          setIsAuthenticated(false);
          setError("Your session has expired. Please sign in again.");
        } else {
          throw new Error(`Failed to fetch sessions: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setSessions(data.sessions);
      }
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

  /**
   * Check authentication status on component mount and when window gains focus
   */
  useEffect(() => {
    // Check initial authentication status
    setIsAuthenticated(hasValidTokens());

    // Update authentication status when window gains focus
    const handleFocus = () => {
      setIsAuthenticated(hasValidTokens());
    };

    window.addEventListener('focus', handleFocus);

    // Clean up event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      <button onClick={startActivity}>Launch Activity in Main Stage.</button>

      <div style={{ marginTop: "20px" }}>
        {/* Authentication section */}
        <div style={{ marginBottom: "20px" }}>
          {!isAuthenticated ? (
            <div>
              <p>You need to sign in to access sessions.</p>
              <GoogleSignInButton onSignIn={() => setIsAuthenticated(true)} />
            </div>
          ) : (
            <div>
              <p>You are signed in.</p>
              <button 
                onClick={() => {
                  clearTokens();
                  setIsAuthenticated(false);
                  setSessions(null);
                }}
                style={{ marginLeft: "10px" }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

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
