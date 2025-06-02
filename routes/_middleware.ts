// deno-lint-ignore-file
import { FreshContext } from "fresh";
import { createPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";
import { logJson, tracer } from "../data/tracing/tracer.ts";

// List of file extensions to ignore for logging
const IGNORED_EXTENSIONS = new Set([
  ".js",
  ".css",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
]);

// List of paths to ignore for logging
const IGNORED_PATHS = new Set([
  "/_frsh/",
  "/_fresh/",
  "/favicon.ico",
  "/api/",
]);

function shouldLogVisit(path: string): boolean {
  // Check if path starts with any ignored path
  for (const ignoredPath of IGNORED_PATHS) {
    if (path.startsWith(ignoredPath)) {
      return false;
    }
  }

  // Check if path ends with any ignored extension
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    const extension = path.slice(lastDotIndex).toLowerCase();
    if (IGNORED_EXTENSIONS.has(extension)) {
      return false;
    }
  }

  return true;
}

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  const url = new URL(req.url);
  const path = url.pathname;

  return await tracer.startActiveSpan(`route:${path}`, async (span) => {
    try {
      // Only log actual page visits, not asset requests
      if (shouldLogVisit(path)) {
        // Log page visit details
        logJson("info", "Page Visit", {
          method: req.method,
          path,
          timestamp: new Date().toISOString(),
          userAgent: req.headers.get("user-agent"),
          referer: req.headers.get("referer"),
          ip: req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip"),
          query: Object.fromEntries(url.searchParams),
        });
      }

      span.setAttribute("http.method", req.method);
      span.setAttribute("http.url", url.toString());
      span.setAttribute("http.path", path);
      span.setAttribute("http.user_agent", req.headers.get("user-agent") || "");
      span.setAttribute("http.referer", req.headers.get("referer") || "");
      span.setAttribute(
        "http.ip",
        req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") ||
          "",
      );

      const pbService = await createPocketBaseService();
      const cookieHeader = req.headers.get("cookie");

      if (cookieHeader) {
        try {
          const user = await pbService.getUser(cookieHeader);
          ctx.state.user = user; // Attach user to context
          span.setAttribute("user.authenticated", true);
          span.setAttribute("user.nickname", user.nickname);
          if (shouldLogVisit(path)) {
            logJson("info", "User visited page", { user: user.nickname, path });
          }
        } catch (_) {
          ctx.state.user = null; // Token invalid or not logged in
          span.setAttribute("user.authenticated", false);
          if (shouldLogVisit(path)) {
            logJson("info", "Anonymous user visited page", { path });
          }
        }
      } else {
        span.setAttribute("user.authenticated", false);
        if (shouldLogVisit(path)) {
          logJson("info", "Anonymous user visited page", { path });
        }
      }

      const response = await ctx.next();

      if (
        url.pathname.endsWith("/devices") ||
        url.pathname.startsWith("/about") ||
        url.pathname.startsWith("/charts")
      ) {
        response.headers.set(
          "Cache-Control",
          "public, max-age=3600, s-maxage=86400",
        );
        response.headers.set(
          "Expires",
          new Date(Date.now() + 86400 * 1000).toUTCString(), // tomorrow
        );
      }

      span.setAttribute("http.status_code", response.status);
      span.setStatus({ code: 0 }); // OK
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";
      span.setStatus({ code: 2, message: errorMessage }); // ERROR
      if (shouldLogVisit(path)) {
        logJson("error", "Page Visit Error", { path, error: errorMessage });
      }
      throw error;
    } finally {
      span.end();
    }
  });
}
