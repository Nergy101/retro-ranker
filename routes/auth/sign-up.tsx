import { CustomFreshState } from "../../interfaces/state.ts";
import { SignUp } from "../../islands/auth/sign-up.tsx";
import { Context, page } from "fresh";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";

export default function SignUpPage(ctx: Context<CustomFreshState>) {
  const baseApiUrl = Deno.env.get("BASE_API_URL")!;
  const csrfToken = (ctx.state as CustomFreshState).csrfToken;

  if (!csrfToken) {
    return new Response(
      JSON.stringify({ error: "CSRF token not found" }),
      {
        status: 400,
      },
    );
  }

  return (
    <>
      <article>
        <SignUp
          baseApiUrl={baseApiUrl}
          csrfToken={csrfToken}
        />
      </article>
    </>
  );
}

export const handler = {
  GET(ctx: Context<CustomFreshState>) {
    const state = ctx.state as CustomFreshState;
    state.seo = {
      title: "Retro Ranker - Sign up",
      description: "Join Retro Ranker using Discord or Google",
    };

    if (state.user) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }
    const url = new URL(ctx.req.url);
    const csrfToken = generateCsrfToken();
    state.csrfToken = csrfToken;
    const csrfCookie = createCsrfCookie(url.hostname, csrfToken);
    const resp = page(ctx, {
      headers: {
        "set-cookie": `${csrfCookie.name}=${csrfCookie.value}; ${
          Object.entries(csrfCookie)
            .filter(([key]) => key !== "name" && key !== "value")
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }`,
      },
    });
    return resp;
  },
};
