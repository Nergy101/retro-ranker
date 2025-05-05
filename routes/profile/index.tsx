import { FreshContext } from "$fresh/server.ts";
import { PiChatCentered, PiHeartFill, PiPlus } from "@preact-icons/pi";
import { RecordModel } from "npm:pocketbase";
import SEO from "../../components/SEO.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { createLoggedInPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";
import SignOut from "../../islands/auth/sign-out.tsx";
import DeviceCollections from "../../islands/collections/device-collections.tsx";
import SuggestionForm from "../../islands/suggestion-form.tsx";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";

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
        filter: `userId = "${user.id}"`,
        expand: "deviceId",
        sort: "-created",
      },
    );

    return (favorites?.items ?? []).map((f) => {
      return (f.expand?.deviceId as RecordModel).deviceData as Device;
    });
  };

  const collections = await getCollections();
  const favoritedDevices = await getFavoritedDevices();

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

        {/* Favorites Section */}
        <section class="favorites-section">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PiHeartFill /> Your Favorites
          </h2>

          {favoritedDevices.length === 0 && (
            <div class="empty-favorites-message">
              <p>You haven't favorited any devices yet.</p>
              <p>Browse devices and click the heart icon to add them to your favorites!</p>
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
                    user={user}
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
                class="button outline contrast"
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
                class="primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  width: "fit-content",
                }}
              >
                <PiPlus /> Create a new collection
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
