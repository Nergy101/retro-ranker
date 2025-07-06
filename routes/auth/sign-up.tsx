import { CustomFreshState } from "@interfaces/state.ts";
import { SignUp } from "@islands/auth/sign-up.tsx";
import { FreshContext, page } from "fresh";

export default function SignUpPage(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const baseApiUrl = Deno.env.get("BASE_API_URL")!;

  return (
    <>
      <article>
        <SignUp baseApiUrl={baseApiUrl} translations={translations} />
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
    return page(ctx);
  },
};
