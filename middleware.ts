import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Try to read tokens from headers first (for iframe environments)
  let accessToken = request.headers.get('X-Auth-Request-Access-Token');
  let idToken = request.headers.get('X-Auth-Request-ID-Token');

  // Fall back to cookies if headers are not available
  if (!accessToken) {
    accessToken = request.cookies.get('access_token')?.value;
  }

  if (!idToken) {
    idToken = request.cookies.get('id_token')?.value;
  }

  // Store access token in request headers for use in server components
  if (accessToken) {
    response.headers.set('X-Auth-Request-Access-Token', accessToken);
  }

  // Extract email from ID token if available
  if (idToken) {
    try {
      const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (payload && payload.email) {
        // Set X-Auth-Request-Email header as requested
        response.headers.set('X-Auth-Request-Email', payload.email);
      }
    } catch (error) {
      console.error('Error verifying ID token:', error);
    }
  }

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api/auth routes (authentication endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
