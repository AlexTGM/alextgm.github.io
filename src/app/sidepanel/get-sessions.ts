"use server";
import { cookies } from "next/headers";
import { OAuth2Client } from 'google-auth-library';

export async function getSessions() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const idToken = cookieStore.get('id_token')?.value;

  const headers: HeadersInit = {};

  if (accessToken) {
    headers['X-Auth-Request-Access-Token'] = accessToken;
  }

  // Extract email from ID token for X-Auth-Request-Email header
  if (idToken) {
    try {
      const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (payload && payload.email) {
        headers['X-Auth-Request-Email'] = payload.email;
      }
    } catch (error) {
      console.error('Error verifying ID token:', error);
    }
  }

  const response = await fetch(
    "https://services.reops.labs.jb.gg/drive-watch/ext/projects/sessions",
    {
      headers,
    }
  );

  return (await response.json()) as { sessions: string[] };
}
