import { CustomFreshState } from "@interfaces/state.ts";
import { SignUp } from "@islands/auth/sign-up.tsx";
import { FreshContext, page } from "fresh";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";

export default function SignUpPage(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};
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
          translations={translations}
          csrfToken={csrfToken}
        />
      </article>
    </>
  );
}

export const handler = {
  GET(ctx: FreshContext) {
    const state = ctx.state as CustomFreshState;
    state.seo = {
      title: "Retro Ranker - Sign up",
      description: "Create your Retro Ranker account",
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
