import { FreshContext, page, PageProps } from "fresh";
import { CustomFreshState } from "../../interfaces/state.ts";
import { SignIn } from "../../islands/auth/sign-in.tsx";

export default function SignInPage(pageProps: PageProps) {
  const error = pageProps.url.searchParams.get("error");
  const loggedIn = pageProps.url.searchParams.get("logged-in");

  return (
    <>
      <div class="sign-in-article">
        <SignIn error={error} pleaseWait={!!loggedIn} />
      </div>
    </>
  );
}

export const handler = {
  GET(ctx: FreshContext) {
    const state = ctx.state as CustomFreshState;
    state.seo = {
      title: "Retro Ranker - Sign in",
      description: "Sign in to your Retro Ranker account",
    };

    if (state.user) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }

    state.data.referrer = ctx.req.referrer;

    return page(ctx);
  },
};
