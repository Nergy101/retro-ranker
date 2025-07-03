export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

import { setCookie, getCookies } from "@std/http/cookie";

export function setCsrfCookie(headers: Headers, hostname: string, token: string) {
  const isProduction = hostname === "retroranker.site";
  setCookie(headers, {
    name: "csrf_token",
    value: token,
    maxAge: 3600,
    sameSite: "Lax",
    path: "/",
    httpOnly: true,
    secure: isProduction,
    ...(isProduction && { domain: hostname }),
  });
}

export function getCsrfTokenFromCookie(headers: Headers): string | undefined {
  const cookies = getCookies(headers);
  return cookies["csrf_token"];
}

export function validateCsrfToken(
  headers: Headers,
  token: string | null | undefined,
): boolean {
  const cookieToken = getCsrfTokenFromCookie(headers);
  return !!cookieToken && !!token && cookieToken === token;
}
