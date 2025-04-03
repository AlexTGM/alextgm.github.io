import { OAuth2Client } from "google-auth-library";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Missing authorization code" }),
      {
        status: 400,
      },
    );
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Prepare a script that will send tokens to the opener window
    const htmlResponse = `
      <script>
        // Check if the window has an opener
        if (window.opener) {
          // Send the tokens to the opener window
          window.opener.postMessage(${JSON.stringify(tokens)}, "*");

          // Close the popup window
          window.close();
        } else {
          console.error("No opener window found.");
        }
      </script>
    `;

    return new Response(htmlResponse, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error while handling Google callback", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve tokens" }),
      {
        status: 500,
      },
    );
  }
}
