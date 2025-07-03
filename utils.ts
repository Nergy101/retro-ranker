import { createDefine } from "fresh";
import { CustomFreshState } from "./interfaces/state.ts";
import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

export interface State extends CustomFreshState {}

export const define = createDefine<State>();

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

/**
 * Create CSRF cookie configuration for different environments
 */
export function createCsrfCookie(
  hostname: string,
  token: string,
) {
  const isProduction = hostname === "retroranker.site";
  return {
    name: "csrf_token",
    value: token,
    maxAge: 3600,
    sameSite: "Lax",
    path: "/",
    httpOnly: false, // Allow JavaScript access for debugging
    secure: isProduction,
    // Don't set domain in development to avoid issues with localhost
    ...(isProduction && { domain: hostname }),
  };
}

/**
 * Get CSRF token from cookies
 */
export function getCsrfTokenFromCookie(headers: Headers): string | undefined {
  const cookies = getCookies(headers);
  console.log(cookies);
  return cookies["csrf_token"];
}

/**
 * Validate CSRF token against cookie token
 */
export function validateCsrfToken(
  headers: Headers,
  token: string | null | undefined,
): boolean {
  const cookieToken = getCsrfTokenFromCookie(headers);
  return !!cookieToken && !!token && cookieToken === token;
}

/**
 * Utility function to set authentication cookies with proper configuration
 * for different environments (development vs production)
 */
export function setAuthCookie(
  headers: Headers,
  token: string,
  hostname: string,
) {
  const isProduction = hostname === "retroranker.site";

  setCookie(headers, {
    name: "pb_auth",
    value: token,
    maxAge: 3600,
    sameSite: "Lax", // More permissive than Strict for OAuth flows
    path: "/",
    secure: isProduction, // Only require HTTPS in production
    httpOnly: true, // Prevent XSS attacks
    // Only set domain in production, not for localhost
    ...(isProduction && { domain: hostname }),
  });
}

/**
 * Utility function to delete authentication cookies with proper configuration
 * for different environments (development vs production)
 */
export function deleteAuthCookie(headers: Headers, hostname: string) {
  const isProduction = hostname === "retroranker.site";

  deleteCookie(headers, "pb_auth", {
    path: "/",
    ...(isProduction && { domain: hostname }),
  });
}
