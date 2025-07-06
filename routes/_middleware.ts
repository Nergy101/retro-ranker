// deno-lint-ignore-file
import { FreshContext } from "fresh";
import { createPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { logJson, tracer } from "@data/tracing/tracer.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import {
  clearTranslationCache,
  getTranslations,
} from "@data/frontend/services/i18n/i18n.service.ts";
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

export async function handler(ctx: FreshContext) {
  const startTime = performance.now();
  const req = ctx.req;
  const url = new URL(req.url);
  const path = url.pathname;
  const cookies = getCookies(req.headers);
  const language = cookies.lang ?? "en-US";

  // Set language in state immediately
  (ctx.state as CustomFreshState).language = language;

  // Check if this is a cache-busting request (for language changes)
  const forceRefresh = url.searchParams.get("refresh") === "true";
  if (forceRefresh) {
    logJson("info", "Force refresh requested", { path, language });
    clearTranslationCache();
  }

  // Load translations asynchronously without blocking
  const translationsStart = performance.now();
  const translationsPromise = getTranslations(language);

  return await tracer.startActiveSpan(`route:${path}`, async (span) => {
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

      // Load translations and PocketBase service in parallel
      const pbStart = performance.now();
      const [translations, pbService] = await Promise.all([
        translationsPromise,
        createPocketBaseService(),
      ]);
      const pbEnd = performance.now();
      const translationsEnd = performance.now();

      if (shouldLogVisit(path)) {
        logJson("info", "Middleware Services Loaded", {
          path,
          translationsTime: `${
            (translationsEnd - translationsStart).toFixed(2)
          }ms`,
          pocketbaseTime: `${(pbEnd - pbStart).toFixed(2)}ms`,
          totalServicesTime: `${(pbEnd - translationsStart).toFixed(2)}ms`,
          hasTranslations: !!translations,
          translationKeys: Object.keys(translations).length,
          language,
        });
      }

      (ctx.state as CustomFreshState).translations = translations;

      const cookieHeader = req.headers.get("cookie");

      if (cookieHeader) {
        try {
          const userAuthStart = performance.now();
          const user = await pbService.getUser(cookieHeader);
          const userAuthEnd = performance.now();

          (ctx.state as CustomFreshState).user = user; // Attach user to context
          span.setAttribute("user.authenticated", true);
          span.setAttribute("user.nickname", user.nickname);

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
          span.setAttribute("user.authenticated", false);
          if (shouldLogVisit(path)) {
            logJson("info", "Anonymous User", {
              path,
              authTime: `${(userAuthEnd - pbEnd).toFixed(2)}ms`,
            });
          }
        }
      } else {
        span.setAttribute("user.authenticated", false);
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

      // Add aggressive caching for translation files
      if (url.pathname.startsWith("/i18n/") && url.pathname.endsWith(".json")) {
        // Add cache-busting for language changes
        const cacheBuster = `lang-${language}-${Date.now()}`;
        response.headers.set(
          "Cache-Control",
          "public, max-age=86400, s-maxage=604800", // 1 day browser, 1 week CDN
        );
        response.headers.set(
          "Expires",
          new Date(Date.now() + 86400 * 1000).toUTCString(),
        );
        response.headers.set("ETag", `"${cacheBuster}"`);
        response.headers.set("Vary", "Accept-Language, Cookie");
      }

      // Add cache-busting headers for language change requests
      if (forceRefresh) {
        response.headers.set(
          "Cache-Control",
          "no-cache, no-store, must-revalidate",
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
        logJson("error", "Page Visit Error", {
          path,
          error: errorMessage,
          totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        });
      }
      throw error;
    } finally {
      span.end();
    }
  });
}
