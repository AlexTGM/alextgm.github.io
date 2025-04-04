import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Read tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  // const refreshToken = request.cookies.get('refresh_token')?.value;
  const idToken = request.cookies.get('id_token')?.value;

  // Store tokens in request headers for use in server components
  if (accessToken) {
    // response.headers.set('x-access-token', accessToken);
    // Set X-Auth-Request-Access-Token header as requested
    response.headers.set('X-Auth-Request-Access-Token', accessToken);
  }

  // if (refreshToken) {
  //   response.headers.set('x-refresh-token', refreshToken);
  // }

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
