import { FreshContext, page, PageProps } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { SignIn } from "@islands/auth/sign-in.tsx";
import { generateCsrfToken, setCsrfCookie } from "../../csrf.ts";

export default function SignInPage(pageProps: PageProps) {
  const error = pageProps.url.searchParams.get("error");
  const loggedIn = pageProps.url.searchParams.get("logged-in");
  const csrfToken = pageProps.data.csrfToken as string;

  return (
    <>
      <div class="sign-in-article">
        <SignIn error={error} pleaseWait={!!loggedIn} csrfToken={csrfToken} />
      </div>
    </>
  );
}

export const handler = {
  GET(ctx: FreshContext) {
    const state = ctx.state as CustomFreshState;
    state.seo = {
      title: "Retro Ranker - Log in",
      description: "Log in to your Retro Ranker account",
    };

    if (state.user) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }

    state.data.referrer = ctx.req.referrer;

    const url = new URL(ctx.req.url);
    const csrfToken = generateCsrfToken();
    state.data.csrfToken = csrfToken;
    const resp = page(ctx);
    setCsrfCookie(resp.headers, url.hostname, csrfToken);
    return resp;
  },
};
