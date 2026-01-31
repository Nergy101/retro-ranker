import { Context } from "fresh";
import {
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import pkceSessionService from "../../../../data/pkce/pkce.service.ts";
import { createPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";
import { logJson, tracer } from "../../../../data/tracing/tracer.ts";
import { setAuthCookie, State } from "../../../../utils.ts";

function isAllowedMobileRedirect(redirectUri: string): boolean {
  try {
    const u = new URL(redirectUri);
    const scheme = u.protocol.replace(":", "");
    const allowedSchemes = new Set([
      "retroranker",
      "exp",
      "exps",
      "expo-development-client",
    ]);
    if (!allowedSchemes.has(scheme)) return false;

    const path = u.pathname || "";
    const host = u.host || "";

    const expoStyleOk = path.includes("/auth/") && path.includes("/callback");
    const standaloneStyleOk = host === "auth" && path.includes("/callback");

    return expoStyleOk || standaloneStyleOk;
  } catch {
    return false;
  }
}

function appendCodeAndState(
  redirectUri: string,
  code: string,
  state: string,
): string {
  const u = new URL(redirectUri);
  u.searchParams.set("code", code);
  u.searchParams.set("state", state);
  return u.toString();
}

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;

    return await tracer.startActiveSpan(
      "google-auth-callback",
      async (span) => {
        const headers = new Headers();
        const url = new URL(req.url);
        let protocol = url.protocol;
        const hostname = url.hostname;
        if (hostname === "retroranker.site") {
          protocol = "https:";
        }
        const port = url.port;
        const fullHost = port
          ? `${protocol}//${hostname}:${port}`
          : `${protocol}//${hostname}`;

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code) {
          logJson("warn", "Missing code in Google callback", { url: req.url });
          span.setStatus({ code: 2, message: "Missing code" });
          return new Response(null, { status: 400 });
        }

        if (!state) {
          logJson("warn", "Missing state in Google callback", {
            url: req.url,
          });
          span.setStatus({ code: 2, message: "Missing state" });
          return new Response(null, { status: 400 });
        }

        const sessionData = pkceSessionService.getSessionData(state, {
          remove: true,
        });

        const redirectUri = sessionData?.redirectUri;

        // Mobile app redirect (Expo Go / dev build / prod build):
        if (redirectUri && isAllowedMobileRedirect(redirectUri)) {
          const mobileRedirectUrl = appendCodeAndState(redirectUri, code, state);
          headers.set("location", mobileRedirectUrl);
          logJson("info", "Redirecting to mobile app", {
            redirectUri: mobileRedirectUrl,
          });
          span.setAttribute("google.oauth2.state", state);
          span.setStatus({ code: 0 });
          return new Response(null, { status: 303, headers });
        }

        if (!sessionData || !sessionData.codeVerifier) {
          logJson(
            "warn",
            "Missing or invalid codeVerifier in Google callback",
            { state },
          );
          span.setStatus({ code: 2, message: "Missing codeVerifier" });
          return new Response(null, { status: 400 });
        }

        const codeVerifier = sessionData.codeVerifier;

        try {
          const numberDictionary = NumberDictionary.generate({
            min: 100,
            max: 999,
          });
          const randomName = uniqueNamesGenerator({
            dictionaries: [animals, numberDictionary], // colors can be omitted here as not used
            separator: "_",
          });

          // Use the same callback URL that was sent to Google (based on request host)
          // This ensures the redirect_uri matches what Google expects
          let protocol = url.protocol;
          const hostname = url.hostname;
          if (hostname === "retroranker.site") {
            protocol = "https:";
          }
          const port = url.port;
          const fullHost = port
            ? `${protocol}//${hostname}:${port}`
            : `${protocol}//${hostname}`;
          const websiteCallbackUrl = `${fullHost}/api/auth/google/callback`;

          const pbService = await createPocketBaseService();
          const user = await pbService.authWithOAuth2Code(
            "google",
            code,
            codeVerifier,
            websiteCallbackUrl,
            {
              nickname: randomName,
            },
          );

          // Google OAuth doesn't always return a name; fallback to email local part
          const email = user.record.email ?? "";
          const nameFromOAuth = user.meta?.name;
          const name =
            nameFromOAuth?.trim() || (email ? email.split("@")[0] : randomName);
          const cleanNickname = name.toLowerCase().replace(/\s+/g, "_");

          await pbService.update("users", user.record.id, {
            nickname: cleanNickname,
          });

          setAuthCookie(headers, user.token, hostname);

          // Web redirect
          headers.set("location", "/auth/sign-in?logged-in=true");

          span.setAttribute("Google.oauth2.state", state);
          span.setAttribute("user.id", user?.record?.id || "");
          span.setStatus({ code: 0 });

          return new Response(null, { status: 303, headers });
        } catch (error) {
          logJson("error", "Error in Google OAuth2 callback", {
            error: error instanceof Error ? error.message : String(error),
            state,
          });
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : String(error),
          });
          return new Response(null, { status: 500 });
        } finally {
          span.end();
        }
      },
    );
  },
};
