import { Context } from "fresh";
import pkceSessionService from "../../../../data/pkce/pkce.service.ts";
import { createPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";
import { logJson, tracer } from "../../../../data/tracing/tracer.ts";
import { setAuthCookie, State } from "../../../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;

    return await tracer.startActiveSpan(
      "discord-auth-callback",
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
          logJson("warn", "Missing code in Discord callback", { url: req.url });
          span.setStatus({ code: 2, message: "Missing code" });
          return new Response(null, { status: 400 });
        }

        if (!state) {
          logJson("warn", "Missing state in Discord callback", {
            url: req.url,
          });
          span.setStatus({ code: 2, message: "Missing state" });
          return new Response(null, { status: 400 });
        }

        const sessionData = pkceSessionService.getSessionData(state, {
          remove: true,
        });

        if (!sessionData || !sessionData.codeVerifier) {
          logJson(
            "error",
            "Missing or invalid codeVerifier in Discord callback",
            { 
              state,
              hasSessionData: !!sessionData,
              code: code ? "present" : "missing",
              url: req.url,
            },
          );
          span.setStatus({ code: 2, message: "Missing codeVerifier" });
          // Return a more helpful error page
          return new Response(
            `OAuth authentication failed: Session expired or invalid. Please try signing in again.`,
            { 
              status: 400,
              headers: { "Content-Type": "text/plain" },
            }
          );
        }

        const codeVerifier = sessionData.codeVerifier;
        const redirectUri = sessionData.redirectUri;

        try {
          // Use the same callback URL that was sent to Discord (based on request host)
          // This ensures the redirect_uri matches what Discord expects
          let protocol = url.protocol;
          const hostname = url.hostname;
          if (hostname === "retroranker.site") {
            protocol = "https:";
          }
          const port = url.port;
          const fullHost = port
            ? `${protocol}//${hostname}:${port}`
            : `${protocol}//${hostname}`;
          const websiteCallbackUrl = `${fullHost}/api/auth/discord/callback`;
          
          const pbService = await createPocketBaseService();
          const user = await pbService.authWithOAuth2Code(
            "discord",
            code,
            codeVerifier,
            websiteCallbackUrl,
            {},
          );

          setAuthCookie(headers, user.token, hostname);

          // Check if this is a mobile app redirect
          if (redirectUri && redirectUri.startsWith("retroranker://")) {
            // Mobile app redirect - include code and state in the deep link
            const mobileRedirectUrl = `${redirectUri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
            headers.set("location", mobileRedirectUrl);
            logJson("info", "Redirecting to mobile app", { redirectUri: mobileRedirectUrl });
          } else {
            // Web redirect
            headers.set("location", "/auth/sign-in?logged-in=true");
          }

          logJson("info", "Discord OAuth2 callback successful", {
            userId: user?.record?.id,
            state,
          });

          span.setAttribute("discord.oauth2.state", state);
          span.setAttribute("user.id", user?.record?.id || "");
          span.setStatus({ code: 0 });

          return new Response(null, { status: 303, headers });
        } catch (error) {
          logJson("error", "Error in Discord OAuth2 callback", {
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
