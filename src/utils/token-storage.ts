"use client";

/**
 * Utility functions for token storage using localStorage
 * This is an alternative to cookie-based storage for environments where cookies are not available (e.g., iframes)
 */

// Token types
export interface Tokens {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expiry_date?: number;
}

// Store tokens in localStorage
export function storeTokens(tokens: Tokens): void {
  if (typeof window === 'undefined') {
    console.error('Cannot store tokens: localStorage is not available on the server');
    return;
  }

  if (tokens.access_token) {
    localStorage.setItem('access_token', tokens.access_token);
  }

  if (tokens.refresh_token) {
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  if (tokens.id_token) {
    localStorage.setItem('id_token', tokens.id_token);
  }

  if (tokens.expiry_date) {
    localStorage.setItem('token_expiry', tokens.expiry_date.toString());
  }
}

// Get tokens from localStorage
export function getTokens(): Tokens {
  if (typeof window === 'undefined') {
    return {};
  }

  const access_token = localStorage.getItem('access_token') || undefined;
  const refresh_token = localStorage.getItem('refresh_token') || undefined;
  const id_token = localStorage.getItem('id_token') || undefined;
  const expiry_date = localStorage.getItem('token_expiry') 
    ? parseInt(localStorage.getItem('token_expiry') || '0', 10) 
    : undefined;

  return {
    access_token,
    refresh_token,
    id_token,
    expiry_date
  };
}

// Clear tokens from localStorage
export function clearTokens(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('token_expiry');
}

// Check if tokens exist and are valid
export function hasValidTokens(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const access_token = localStorage.getItem('access_token');
  if (!access_token) {
    return false;
  }

  const expiry_date = localStorage.getItem('token_expiry');
  if (expiry_date && parseInt(expiry_date, 10) < Date.now()) {
    // Token has expired, clear it
    clearTokens();
    return false;
  }

  return true;
}

// Add tokens to fetch request options
export function addTokensToRequest(options: RequestInit = {}): RequestInit {
  const tokens = getTokens();
  const headers = new Headers(options.headers || {});

  if (tokens.access_token) {
    headers.set('X-Auth-Request-Access-Token', tokens.access_token);
  }

  // Extract email from ID token if available
  if (tokens.id_token && typeof window !== 'undefined') {
    // Note: We can't verify the ID token on the client side in the same way as the server
    // Instead, we'll send the ID token and let the server verify it
    headers.set('X-Auth-Request-ID-Token', tokens.id_token);
  }

  return {
    ...options,
    headers
  };
}

// Create an authenticated fetch function
export function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const requestOptions = addTokensToRequest(options);
  return fetch(url, requestOptions);
}
