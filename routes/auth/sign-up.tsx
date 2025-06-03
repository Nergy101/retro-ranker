import { FreshContext, page } from "fresh";
// import SEO from "../../components/SEO.tsx";
import { Handlers as _Handlers } from "fresh/compat";
import { SignUp } from "../../islands/auth/sign-up.tsx";
import { CustomFreshState } from "../../interfaces/state.ts";

export default function SignUpPage() {
  const baseApiUrl = Deno.env.get("BASE_API_URL")!;

  return (
    <>
      <article>
        <SignUp baseApiUrl={baseApiUrl} />
      </article>
    </>
  );
}

export const handler = {
  GET(ctx: FreshContext) {
    const state = ctx.state as CustomFreshState;
    state.seo = {
      title: "Sign up",
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
