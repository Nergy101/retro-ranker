import { PiChatCentered, PiPlus } from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { RecordModel } from "npm:pocketbase";
import { DeviceCardMedium } from "@components/cards/device-card-medium.tsx";
import { DeviceCollection } from "@data/frontend/contracts/device-collection.ts";
import { Device } from "@data/frontend/contracts/device.model.ts";
import {
  createLoggedInPocketBaseService,
  createSuperUserPocketBaseService,
} from "@data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { SignOut } from "@islands/auth/sign-out.tsx";
import { DeviceCollections } from "@islands/collections/device-collections.tsx";
import { SuggestionForm } from "@islands/profile/suggestion-form.tsx";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Profile",
      description: "Profile page",
    };
    const url = new URL(ctx.req.url);
    const csrfToken = generateCsrfToken();
    (ctx.state as CustomFreshState).csrfToken = csrfToken;
    const csrfCookie = createCsrfCookie(url.hostname, csrfToken);
    const resp = page(ctx, {
      headers: {
        "set-cookie": `${csrfCookie.name}=${csrfCookie.value}; ${
          Object.entries(csrfCookie)
            .filter(([key]) => key !== "name" && key !== "value")
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }`,
      },
    });
    return resp;
  },
};

export default async function ProfilePage(
  ctx: FreshContext,
) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const req = ctx.req;
  const state = ctx.state as CustomFreshState;
  const csrfToken = state.csrfToken;

  if (!csrfToken) {
    return new Response(
      JSON.stringify({ error: "CSRF token not found" }),
      {
        status: 400,
      },
    );
  }

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

  const deviceIds = Array.from(
    new Set([
      ...favoritedDevices.map((d) => d.id),
      ...collections.flatMap((c) => c.devices.map((d) => d.id)),
    ]),
  );

  const pb = await createSuperUserPocketBaseService(
    Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
    Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
    Deno.env.get("POCKETBASE_URL")!,
  );

  const likesFilter = deviceIds.map((id) => `device="${id}"`).join(" || ");
  const likeRecords = deviceIds.length > 0
    ? await pb.getAll("device_likes", {
      filter: likesFilter,
      expand: "",
      sort: "",
    })
    : [];

  const likesCountMap: Record<string, number> = {};
  const userLikedMap: Record<string, boolean> = {};
  for (const r of likeRecords) {
    likesCountMap[r.device] = (likesCountMap[r.device] || 0) + 1;
    if (r.user === user.id) {
      userLikedMap[r.device] = true;
    }
  }

  const userFavoritedMap: Record<string, boolean> = {};
  for (const d of favoritedDevices) {
    userFavoritedMap[d.id] = true;
  }

  const getWelcomeText = () => {
    const texts = [
      TranslationPipe(translations, "profile.welcome.playerOne"),
      TranslationPipe(translations, "profile.welcome.hero"),
      TranslationPipe(translations, "profile.welcome.continue"),
      TranslationPipe(translations, "profile.welcome.backForMore"),
      TranslationPipe(translations, "profile.welcome.letsGo"),
      TranslationPipe(translations, "profile.welcome.backOnline"),
      TranslationPipe(translations, "profile.welcome.linkEstablished"),
      TranslationPipe(translations, "profile.welcome.respawned"),
      TranslationPipe(translations, "profile.welcome.insertSnacks"),
      TranslationPipe(translations, "profile.welcome.bootComplete"),
      TranslationPipe(translations, "profile.welcome.memoryCard"),
      TranslationPipe(translations, "profile.welcome.retroXP"),
      TranslationPipe(translations, "profile.welcome.retroVibes"),
      TranslationPipe(translations, "profile.welcome.handheldDimension"),
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <div>
      <article>
        <header>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>
              {getWelcomeText()}{" "}
              {TranslationPipe(translations, "profile.welcome.back")},{" "}
              {user.nickname}.
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
            {TranslationPipe(translations, "profile.favorites.title")}
          </h2>

          {favoritedDevices.length === 0 && (
            <div class="empty-favorites-message">
              <p>{TranslationPipe(translations, "profile.favorites.empty")}</p>
              <p>
                {TranslationPipe(
                  translations,
                  "profile.favorites.emptyDescription",
                )}
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
                    isLoggedIn={true}
                    likes={likesCountMap[device.id] ?? 0}
                    isLiked={userLikedMap[device.id] ?? false}
                    isFavorited={true}
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
            <h2>
              {TranslationPipe(translations, "profile.collections.title")}
            </h2>
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
                <PiPlus />{" "}
                {TranslationPipe(translations, "profile.collections.createNew")}
              </a>
            )}
          </div>

          {collections.length === 0 && (
            <div class="empty-collection-message">
              <p>
                {TranslationPipe(translations, "profile.collections.empty")}
              </p>
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
                <PiPlus />
                {TranslationPipe(translations, "profile.collections.createNew")}
              </a>
            </div>
          )}

          <div class="collection-container">
            <DeviceCollections
              collections={collections}
              isLoggedIn={true}
              likesCountMap={likesCountMap}
              userLikedMap={userLikedMap}
              userFavoritedMap={userFavoritedMap}
            />
          </div>
        </section>

        <hr />

        {/* Suggestions Section */}
        <section
          class="suggestions-section"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PiChatCentered />{" "}
            {TranslationPipe(translations, "profile.feedback.title")}
          </h2>
          <SuggestionForm csrfToken={csrfToken} />
        </section>

        <footer
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <SignOut
            buttonText={TranslationPipe(translations, "auth.signOut")}
            className="outline secondary"
          />
        </footer>
      </article>
    </div>
  );
}
