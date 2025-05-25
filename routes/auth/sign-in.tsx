import SEO from "../../components/SEO.tsx";
import SignIn from "../../islands/auth/sign-in.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

export default function SignInPage(pageProps: PageProps) {
  const error = pageProps.url.searchParams.get("error");
  const loggedIn = pageProps.url.searchParams.get("logged-in");

  return (
    <>
      <SEO
        title="Sign In"
        description="Sign in to your Retro Ranker account"
      />
      <div class="sign-in-article">
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <img
            src="/images/rr-star.png"
            alt="Retro Ranker"
            class="hero-image sign-in sign-in-image-mobile"
          />
        </div>
        <SignIn error={error} pleaseWait={!!loggedIn} />

        <img
          src="/images/rr-star.png"
          alt="Retro Ranker"
          class="hero-image sign-in"
        />
      </div>
    </>
  );
}

export const handler: Handlers = {
  GET(req, ctx) {
    if (ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { location: "/profile" },
      });
    }
    return ctx.render(req.referrer);
  },
};
