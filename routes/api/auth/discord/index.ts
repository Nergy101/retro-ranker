import { Context } from "fresh";
import pkceSessionService, {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../../../../data/pkce/pkce.service.ts";
import { logJson, tracer } from "../../../../data/tracing/tracer.ts";
import { State } from "../../../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;

    return await tracer.startActiveSpan("discord-auth-start", async (span) => {
      try {
        // get host from ctx/req (+ port)
        const url = new URL(req.url);

        // Check if redirect_uri is provided (for mobile app final redirect)
        const mobileRedirectUri = url.searchParams.get("redirect_uri");
        const requestedState = url.searchParams.get("state") || undefined;
        const requestedCodeChallenge =
          url.searchParams.get("code_challenge") || undefined;

        // For mobile (app) login, the app generates PKCE verifier/challenge and we must
        // reuse the app-provided state + code_challenge so the app can complete the flow.
        // For web login, we generate PKCE server-side as before.
        const isMobile = !!mobileRedirectUri;
        const stateId = requestedState || crypto.randomUUID();

        let codeVerifier: string;
        let codeChallenge: string;
        if (isMobile) {
          if (!requestedState || !requestedCodeChallenge) {
            logJson("warn", "Missing PKCE params for mobile Discord auth", {
              hasState: !!requestedState,
              hasCodeChallenge: !!requestedCodeChallenge,
            });
            return new Response("Missing PKCE parameters", { status: 400 });
          }
          // Store a placeholder verifier; mobile flow won't use it server-side.
          codeVerifier = "mobile";
          codeChallenge = requestedCodeChallenge;
        } else {
          codeVerifier = generateCodeVerifier();
          codeChallenge = await generateCodeChallenge(codeVerifier);
        }

        pkceSessionService.storeInSession(
          stateId,
          codeVerifier,
          mobileRedirectUri || undefined,
        );

        logJson("info", "Stored PKCE session", {
          state: stateId,
          isMobile,
          hasMobileRedirect: !!mobileRedirectUri,
        });

        // Determine callback URL based on request host
        // For production, always use retroranker.site
        // For local development, use localhost
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

        const discordUrl =
          "https://discord.com/oauth2/authorize?client_id=1371560910706966638&response_type=code&redirect_uri=" +
          encodeURIComponent(websiteCallbackUrl) +
          "&scope=identify" +
          `&code_challenge=${codeChallenge}` +
          `&code_challenge_method=S256` +
          `&state=${stateId}`;

        logJson("info", "Starting Discord OAuth2 flow", {
          state: stateId,
          url: discordUrl,
        });
        span.setAttribute("discord.oauth2.state", stateId);
        span.setAttribute("discord.oauth2.redirect_url", discordUrl);

        return Response.redirect(discordUrl, 302);
      } catch (error) {
        logJson("error", "Error starting Discord OAuth2 flow", {
          error: error instanceof Error ? error.message : String(error),
        });
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    });
  },
};
