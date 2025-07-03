import { CustomFreshState } from "@interfaces/state.ts";
import { SignIn } from "@islands/auth/sign-in.tsx";
import { FreshContext, page, PageProps } from "fresh";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";
import { ProblemDetail } from "@data/frontend/contracts/problem-detail.ts";

export default function SignInPage(pageProps: PageProps) {
  const error = pageProps.url.searchParams.get("error");
  const loggedIn = pageProps.url.searchParams.get("logged-in");
  const csrfToken = (pageProps.state as CustomFreshState).csrfToken;

  if (!csrfToken) {
    return new Response(
      JSON.stringify(ProblemDetail.badRequest("CSRF token not found")),
      {
        status: 400,
      },
    );
  }

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
    state.csrfToken = csrfToken;
    const csrfCookie = createCsrfCookie(url.hostname, csrfToken);
    const resp = page(ctx, {
      headers: {
        "set-cookie": `${csrfCookie.name}=${csrfCookie.value}; ${
          Object.entries(csrfCookie)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }`,
      },
    });
    return resp;
  },
};
