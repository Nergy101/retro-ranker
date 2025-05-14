import { Handlers } from "$fresh/server.ts";
import SEO from "../../components/SEO.tsx";
import SignUp from "../../islands/auth/sign-up.tsx";

export default function SignUpPage() {
  const baseApiUrl = Deno.env.get("BASE_API_URL")!;

  return (
    <>
      <SEO
        title="Sign up"
        description="Create your Retro Ranker account"
      />
      <article>
        <SignUp baseApiUrl={baseApiUrl} />
      </article>
    </>
  );
}


export const handler: Handlers = {
  GET(_, ctx) {
    if (ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }
    return ctx.render();
  },
};
