import { FreshContext, page, PageProps } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { SignIn } from "@islands/auth/sign-in.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export default function SignInPage(pageProps: PageProps, ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const error = pageProps.url.searchParams.get("error");
  const loggedIn = pageProps.url.searchParams.get("logged-in");

  return (
    <>
      <div class="sign-in-article">
        <SignIn
          error={error}
          pleaseWait={!!loggedIn}
          translations={translations}
        />
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

    return page(ctx);
  },
};
