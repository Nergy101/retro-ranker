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
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const randomId = crypto.randomUUID();

        pkceSessionService.storeInSession(randomId, codeVerifier);

        // get host from ctx/req (+ port)
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

        const discordUrl =
          "https://discord.com/oauth2/authorize?client_id=1371560910706966638&response_type=code&redirect_uri=" +
          encodeURIComponent(
            `${fullHost}/api/auth/discord/callback`,
          ) +
          "&scope=identify" +
          `&code_challenge=${codeChallenge}` +
          `&code_challenge_method=S256` +
          `&state=${randomId}`;

        logJson("info", "Starting Discord OAuth2 flow", {
          state: randomId,
          url: discordUrl,
        });
        span.setAttribute("discord.oauth2.state", randomId);
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
