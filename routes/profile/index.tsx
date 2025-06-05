import { PiChatCentered, PiPlus } from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { RecordModel } from "npm:pocketbase";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { createLoggedInPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { SignOut } from "../../islands/auth/sign-out.tsx";
import { DeviceCollections } from "../../islands/collections/device-collections.tsx";
import { SuggestionForm } from "../../islands/profile/suggestion-form.tsx";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Profile",
      description: "Profile page",
    };
    return page(ctx);
  },
};

export default async function ProfilePage(
  ctx: FreshContext,
) {
  const req = ctx.req;
  const state = ctx.state as CustomFreshState;

  if (!state.user) {
    const headers = new Headers();
    headers.set("location", "/auth/sign-in");
    return new Response(null, { status: 303, headers });
  }

  const user = state.user;

  const getCollections = async (): Promise<DeviceCollection[]> => {
    const pbService = await createLoggedInPocketBaseService(
      req.headers.get("cookie") ?? "",
    );

    const userCollections = await pbService.getList(
      "device_collections",
      1,
      100,
      {
        filter: `owner = "${user.id}"`,
        expand: "devices,owner",
        sort: "-created",
      },
    );

    return (userCollections?.items ?? []).map((d) => {
      return {
        id: d.id,
        owner: d.expand?.owner.nickname,
        name: d.name,
        type: d.type,
        order: d.order,
        created: d.created,
        updated: d.updated,
        devices: (d.expand?.devices ?? []).map((de: RecordModel) => {
          return de.deviceData as Device;
        }),
        deviceCount: (d.expand?.devices ?? []).length,
        description: d.description,
      };
    });
  };

  const getFavoritedDevices = async (): Promise<Device[]> => {
    const pbService = await createLoggedInPocketBaseService(
      req.headers.get("cookie") ?? "",
    );

    const favorites = await pbService.getList(
      "device_favorites",
      1,
      100,
      {
        filter: `user = "${user.id}"`,
        expand: "device",
        sort: "-created",
      },
    );

    return (favorites?.items ?? []).map((f) => {
      return (f.expand?.device as RecordModel).deviceData as Device;
    });
  };

  const collections = await getCollections();
  const favoritedDevices = await getFavoritedDevices();

  const getWelcomeText = () => {
    const texts = [
      "Player One.",
      "Hero of the pixelverse!",
      "Continue? > YES >",
      "Back for more pixels?",
      "Let's-a go!",
      "Back online — systems are green.",
      "Link re-established -",
      "You've respawned!",
      "Insert snacks, not coins.",
      "Boot sequence complete.",
      "Memory card detected.",
      "Ready to collect some Retro XP?",
      "Retro vibes restored.",
      "Back in the handheld dimension.",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <div>
      <article>
        <header>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>
              {getWelcomeText()} Welcome back, {user.nickname}.
            </span>
          </h1>
        </header>

        {/* Favorites Section */}
        <section class="favorites-section">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img
              src="/images/rr-heart.png"
              alt="Retro Ranker Heart"
              style={{
                width: "auto",
                height: "4em",
                marginLeft: "0.5rem",
                transform: "scaleX(-1)",
              }}
            />
            Your Favorites
          </h2>

          {favoritedDevices.length === 0 && (
            <div class="empty-favorites-message">
              <p>You haven't favorited any devices yet.</p>
              <p>
                Browse devices and click the heart icon to add them to your
                favorites!
              </p>
            </div>
          )}

          {favoritedDevices.length > 0 && (
            <div class="device-row-grid">
              {favoritedDevices.map((device) => (
                <a
                  href={`/devices/${device.name.sanitized}`}
                  style={{ textDecoration: "none" }}
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={false}
                  />
                </a>
              ))}
            </div>
          )}
        </section>

        <hr />

        {/* Collection Section */}
        <section class="collection-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "space-between",
            }}
          >
            <h2>Your Collections</h2>
            {collections.length > 0 && (
              <a
                href={`/collections/create`}
                role="button"
                type="button"
                class="button outline insert-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <PiPlus /> Create a new collection
              </a>
            )}
          </div>

          {collections.length === 0 && (
            <div class="empty-collection-message">
              <p>You haven't created any collections yet.</p>
              <a
                href={`/collections/create`}
                role="button"
                class="outline insert-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  width: "fit-content",
                }}
              >
                <PiPlus />Create a new collection
              </a>
            </div>
          )}

          <div class="collection-container">
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
          <SuggestionForm />
        </section>

        <footer
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <SignOut
            buttonText="Log Out"
            className="outline secondary"
          />
        </footer>
      </article>
    </div>
  );
}
