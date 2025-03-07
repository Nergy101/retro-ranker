import { FreshContext } from "$fresh/server.ts";
import { PiPlus } from "@preact-icons/pi";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
import SEO from "../components/SEO.tsx";
import SignOut from "../islands/auth/sign-out.tsx";
import { ShareButton } from "../islands/buttons/ShareButton.tsx";
import { User } from "../data/contracts/user.contract.ts";

export default async function ProfilePage(
  req: Request,
  ctx: FreshContext,
) {
  const url = new URL(req.url);

  if (!ctx.state.user) {
    const headers = new Headers();
    headers.set("location", "/auth/sign-in");
    return new Response(null, { status: 303, headers });
  }
  const user = ctx.state.user as User;

  const safeName = slugify(user.nickname);

  return (
    <div class="container">
      <SEO
        title="Profile"
        description="Profile page"
        url={`https://retroranker.site${url.pathname}`}
        robots="noindex, nofollow"
      />

      <article>
        <header>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>
              Hello there, {user.nickname}!
            </span>
          </h1>
        </header>

        {/* Collection Section */}
        <section class="collection-section">
          <h2>Your Collection</h2>
          <p>Manage your personal collection of handheld devices.</p>

          <div class="collection-container">
            {/* This would be populated with actual data */}
            <div class="empty-collection-message">
              <p>You haven't added any devices to your collection yet.</p>
              <a
                href={`/collections/${safeName}`}
                role="button"
                class="primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  width: "fit-content",
                }}
              >
                <PiPlus /> Create your collection
              </a>
            </div>
          </div>
        </section>

        <footer style={{ display: "flex", gap: "0.5rem" }}>
          <SignOut
            buttonText="Log Out"
            className="outline secondary"
          />
          <ShareButton
            appearance="outline"
            title="Share your collection"
            shareTitle="Check out my handheld collection:"
            url={`https://retroranker.site/collection/${safeName}`}
          />
        </footer>
      </article>
    </div>
  );
}
