import { createDefine } from "fresh";
import { CustomFreshState } from "./interfaces/state.ts";
import { deleteCookie, setCookie } from "@std/http/cookie";

export interface State extends CustomFreshState {}

export const define = createDefine<State>();

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
