import { FreshContext } from "$fresh/server.ts";
import { PiChatCentered, PiPlus } from "@preact-icons/pi";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";
import SEO from "../../components/SEO.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import SignOut from "../../islands/auth/sign-out.tsx";
import DeviceCollections from "../../islands/profile/DeviceCollections.tsx";
import SuggestionForm from "../../islands/suggestion-form.tsx";

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

  const getCollections = async (_: string) => {
    const deviceService = DeviceService.getInstance();
    const personalPickDevices = deviceService.getPersonalPicks();
    const rg35xxDevices = deviceService.searchDevices(
      "rg-35xx",
      "all",
      "alphabetical",
      "all",
      [],
      1,
      10,
    ).page;

    const collections = [{
      id: "1",
      name: "Personal Picks",
      devices: personalPickDevices,
      created: new Date(new Date().setDate(new Date().getDate() - 2)),
      updated: new Date(new Date().setDate(new Date().getDate() - 1)),
      deviceCount: personalPickDevices.length,
    }, {
      id: "2",
      name: "RG35XX",
      devices: rg35xxDevices,
      created: new Date(new Date().setDate(new Date().getDate() - 2)),
      updated: new Date(new Date().setDate(new Date().getDate() - 1)),
      deviceCount: rg35xxDevices.length,
    }] as DeviceCollection[];
    return collections;
  };

  const collections = await getCollections(user.id);

  return (
    <div>
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
          <h2>Your Collections (mock-up 🚧)</h2>

          <div class="collection-container">
            {/* This would be populated with actual data */}
            {collections.length === 0 && (
              <div class="empty-collection-message">
                <p>You haven't created any collections yet.</p>
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
                  disabled
                >
                  <PiPlus /> Create a new collection 🚧 (coming soon)
                </a>
              </div>
            )}

            <DeviceCollections collections={collections} />
          </div>
        </section>

        <hr />

        {/* Suggestions Section */}
        <section
          class="suggestions-section"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PiChatCentered /> Feedback
          </h2>
          <SuggestionForm userEmail={user.email} />
        </section>

        <footer style={{ display: "flex", gap: "0.5rem" }}>
          <SignOut
            buttonText="Log Out"
            className="outline secondary"
          />
        </footer>
      </article>
    </div>
  );
}
