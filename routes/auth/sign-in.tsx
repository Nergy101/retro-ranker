// TranslationPipe removed - using simple text instead
import { CustomFreshState } from "../../interfaces/state.ts";
import { SignIn } from "../../islands/auth/sign-in.tsx";
import { Context, page } from "fresh";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";

export default function SignInPage(ctx: Context<CustomFreshState>) {
  const csrfToken = (ctx.state as CustomFreshState)?.csrfToken ?? "";
  const searchParams = new URL(ctx.req.url).searchParams;
  const error = searchParams.get("error");
  const loggedIn = searchParams.get("logged-in");

  return (
    <>
      <div class="sign-in-article">
        <SignIn
          error={error}
          pleaseWait={!!loggedIn}
          csrfToken={csrfToken}
        />
      </div>
    </>
  );
}

export const handler = {
  GET(ctx: Context<CustomFreshState>) {
    const state = ctx.state as CustomFreshState;

    // Ensure state is properly initialized
    if (!state) {
      return new Response("Internal Server Error", { status: 500 });
    }

    state.seo = {
      title: "Sign In - Retro Ranker",
      description:
        "Sign in to your Retro Ranker account to access personalized features and save your preferences.",
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
