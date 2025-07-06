import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { SignIn } from "@islands/auth/sign-in.tsx";
import { FreshContext, page } from "fresh";

export default function SignInPage(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState)?.translations ?? {};
  const searchParams = new URL(ctx.req.url).searchParams;
  const error = searchParams.get("error");
  const loggedIn = searchParams.get("logged-in");

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

    // Ensure state is properly initialized
    if (!state) {
      return new Response("Internal Server Error", { status: 500 });
    }

    const translations = state.translations ?? {};

    state.seo = {
      title: TranslationPipe(translations, "auth.signInPage.title"),
      description: TranslationPipe(translations, "auth.signInPage.description"),
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
