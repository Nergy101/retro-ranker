// deno-lint-ignore-file
// import { Context } from "jsr:@fresh/core@2.0.0-beta.4";
import { createPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";
import { logJson } from "../data/tracing/tracer.ts";
import { CustomFreshState } from "../interfaces/state.ts";
import { getCookies } from "@std/http/cookie";

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

export async function handler(ctx: any) {
  const startTime = performance.now();
  const req = ctx.req;
  const url = new URL(req.url);
  const path = url.pathname;
  const cookies = getCookies(req.headers);

  // Set language in state immediately
  (ctx.state as CustomFreshState).language = "en-US";

  // Check if this is a cache-busting request (for language changes)
  const forceRefresh = url.searchParams.get("refresh") === "true";
  if (forceRefresh) {
    logJson("info", "Force refresh requested", { path });
  }

  try {
    // Only log actual page visits, not asset requests
    if (shouldLogVisit(path)) {
      // Log page visit details
      logJson("info", "Page Visit Started", {
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

    // Load PocketBase service
    const pbStart = performance.now();
    const pbService = await createPocketBaseService();
    const pbEnd = performance.now();

    if (shouldLogVisit(path)) {
      logJson("info", "Middleware Services Loaded", {
        path,
        pocketbaseTime: `${(pbEnd - pbStart).toFixed(2)}ms`,
      });
    }

    (ctx.state as CustomFreshState).translations = {};

    const cookieHeader = req.headers.get("cookie");

    if (cookieHeader) {
      try {
        const userAuthStart = performance.now();
        const user = await pbService.getUser(cookieHeader);
        const userAuthEnd = performance.now();

        (ctx.state as CustomFreshState).user = user; // Attach user to context

        if (shouldLogVisit(path)) {
          logJson("info", "User Authentication", {
            user: user.nickname,
            path,
            authTime: `${(userAuthEnd - userAuthStart).toFixed(2)}ms`,
          });
        }
      } catch (_) {
        const userAuthEnd = performance.now();
        (ctx.state as CustomFreshState).user = null; // Token invalid or not logged in
        if (shouldLogVisit(path)) {
          logJson("info", "Anonymous User", {
            path,
            authTime: `${(userAuthEnd - pbEnd).toFixed(2)}ms`,
          });
        }
      }
    } else {
      if (shouldLogVisit(path)) {
        logJson("info", "No Cookie - Anonymous User", { path });
      }
    }

    if ((ctx.state as CustomFreshState).data === undefined) {
      (ctx.state as CustomFreshState).data = {};
    }

    const nextStart = performance.now();
    const response = await ctx.next();
    const nextEnd = performance.now();

    if (shouldLogVisit(path)) {
      logJson("info", "Route Handler Completed", {
        path,
        routeHandlerTime: `${(nextEnd - nextStart).toFixed(2)}ms`,
        totalMiddlewareTime: `${(nextEnd - startTime).toFixed(2)}ms`,
      });
    }

    // Add caching headers for different types of content
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

    // Add cache-busting headers for language change requests
    if (forceRefresh) {
      response.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate",
      );
    }

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    if (shouldLogVisit(path)) {
      logJson("error", "Page Visit Error", {
        path,
        error: errorMessage,
        totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      });
    }
    throw error;
  }
}
