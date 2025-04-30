import SEO from "../../components/SEO.tsx";
import SignIn from "../../islands/auth/sign-in.tsx";

export default function SignInPage({
  url,
}: {
  url: URL;
}) {
  const error = url.searchParams.get("error");

  return (
    <>
      <SEO
        title="Sign In"
        description="Sign in to your Retro Ranker account"
      />
      <article>
        <SignIn error={error} />
      </article>
    </>
  );
}
