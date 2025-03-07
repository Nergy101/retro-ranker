import { Handlers } from "$fresh/server.ts";
import SEO from "../../components/SEO.tsx";
import SignUp from "../../islands/auth/sign-up.tsx";

export default function SignUpPage() {
  return (
    <>
      <SEO
        title="Sign Up | Retro Ranker"
        description="Create your Retro Ranker account"
      />
      <article>
        <SignUp />
      </article>
    </>
  );
}

// Server-side handler to redirect authenticated users
export const handler: Handlers = {
  GET(req: Request, ctx) {
    // Check if user is already authenticated
    const authCookie = req.headers.get("cookie")?.match(/auth=([^;]+)/)?.[1];

    // If authenticated, redirect to home page
    if (authCookie) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }

    // Otherwise, render the sign-up page
    return ctx.render();
  },
};
