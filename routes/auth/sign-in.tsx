import SEO from "../../components/SEO.tsx";
import SignIn from "../../islands/auth/sign-in.tsx";

export default function SignInPage() {
  return (
    <>
      <SEO
        title="Sign In"
        description="Sign in to your Retro Ranker account"
      />
      <article>
        <SignIn />
      </article>
    </>
  );
}
