import { FreshContext, page, PageProps } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { SignUp } from "@islands/auth/sign-up.tsx";
import { generateCsrfToken, setCsrfCookie } from "../../csrf.ts";

export default function SignUpPage(pageProps: PageProps) {
  const baseApiUrl = Deno.env.get("BASE_API_URL")!;
  const csrfToken = pageProps.data.csrfToken as string;

  return (
    <>
      <article>
        <SignUp baseApiUrl={baseApiUrl} csrfToken={csrfToken} />
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
    state.data.csrfToken = csrfToken;
    const resp = page(ctx);
    setCsrfCookie(resp.headers, url.hostname, csrfToken);
    return resp;
  },
};
