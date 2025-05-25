import { Handlers } from "$fresh/server.ts";
import { setCookie } from "@std/http/cookie";
import { createPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";
import pkceSessionService from "../../../../data/pkce/pkce.service.ts";
import { logJson, tracer } from "../../../../data/tracing/tracer.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
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

        const codeVerifier = pkceSessionService.getFromSession(state, {
          remove: true,
        });

        if (!codeVerifier) {
          logJson(
            "warn",
            "Missing or invalid codeVerifier in Discord callback",
            { state },
          );
          span.setStatus({ code: 2, message: "Missing codeVerifier" });
          return new Response(null, { status: 400 });
        }

        try {
          const pbService = await createPocketBaseService();
          const user = await pbService.authWithOAuth2Code(
            "discord",
            code,
            codeVerifier,
            `${fullHost}/api/auth/discord/callback`,
            {},
          );

          setCookie(headers, {
            name: "pb_auth",
            value: user.token,
            maxAge: 3600,
            sameSite: "Strict",
            domain: url.hostname,
            path: "/",
            secure: true,
          });

          headers.set("location", "/auth/sign-in?logged-in=true");

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
