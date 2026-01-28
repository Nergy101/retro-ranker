import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../../../../data/pkce/pkce.service.ts";
import pkceSessionService from "../../../../data/pkce/pkce.service.ts";
import { logJson, tracer } from "../../../../data/tracing/tracer.ts";
import { Context } from "fresh";
import { State } from "../../../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;

    return await tracer.startActiveSpan("google-auth-start", async (span) => {
      try {
        // get host from ctx/req (+ port)
        const url = new URL(req.url);

        // Check if redirect_uri is provided (for mobile app final redirect)
        const mobileRedirectUri = url.searchParams.get("redirect_uri");
        const requestedState = url.searchParams.get("state") || undefined;
        const requestedCodeChallenge =
          url.searchParams.get("code_challenge") || undefined;

        const isMobile = !!mobileRedirectUri;
        const stateId = requestedState || crypto.randomUUID();

        let codeVerifier: string;
        let codeChallenge: string;
        if (isMobile) {
          if (!requestedState || !requestedCodeChallenge) {
            logJson("warn", "Missing PKCE params for mobile Google auth", {
              hasState: !!requestedState,
              hasCodeChallenge: !!requestedCodeChallenge,
            });
            return new Response("Missing PKCE parameters", { status: 400 });
          }
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
        const websiteCallbackUrl = `${fullHost}/api/auth/google/callback`;

        const googleUrl =
          "https://accounts.google.com/o/oauth2/v2/auth?client_id=384634892886-g7mbiqpno7uo5mrtdop2mdk1pud7k0po.apps.googleusercontent.com&response_type=code&redirect_uri=" +
          encodeURIComponent(websiteCallbackUrl) +
          "&scope=https://www.googleapis.com/auth/plus.login" +
          `&code_challenge=${codeChallenge}` +
          `&code_challenge_method=S256` +
          `&state=${stateId}`;

        logJson("info", "Starting Google OAuth2 flow", {
          state: stateId,
          url: googleUrl,
        });
        span.setAttribute("google.oauth2.state", stateId);
        span.setAttribute("google.oauth2.redirect_url", googleUrl);

        return Response.redirect(googleUrl, 302);
      } catch (error) {
        logJson("error", "Error starting Google OAuth2 flow", {
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
