import { PiChatCentered, PiPlus, PiTrophy } from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { RecordModel } from "pocketbase";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { buildAchievementBoard } from "../../data/frontend/helpers/achievement.helpers.ts";
import { UserAchievementRecord } from "../../data/frontend/contracts/achievement.contract.ts";
import {
  createLoggedInPocketBaseService,
  createSuperUserPocketBaseService,
} from "../../data/pocketbase/pocketbase.service.ts";
import type { PocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";
import { logJson } from "../../data/tracing/tracer.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { SignOut } from "../../islands/auth/sign-out.tsx";
import { DeviceCollections } from "../../islands/collections/device-collections.tsx";
import { SuggestionForm } from "../../islands/profile/suggestion-form.tsx";
import { createCsrfCookie, generateCsrfToken } from "../../utils.ts";

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
  const _translations = (ctx.state as CustomFreshState).translations ?? {};
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

  const pbService = await createLoggedInPocketBaseService(
    req.headers.get("cookie") ?? "",
  );

  const getCollections = async (
    client: PocketBaseService,
  ): Promise<DeviceCollection[]> => {
    const userCollections = await client.getList(
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

  const getFavoritedDevices = async (
    client: PocketBaseService,
  ): Promise<Device[]> => {
    const favorites = await client.getList(
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

  const getUserCommentCount = async (
    client: PocketBaseService,
  ): Promise<number> => {
    try {
      const comments = await client.getList(
        "device_comments",
        1,
        1,
        {
          filter: `user = "${user.id}"`,
          sort: "-created",
          expand: "",
        },
      );
      return comments.totalItems ?? comments.items.length ?? 0;
    } catch (error) {
      logJson("debug", "Failed to fetch user comment count", {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  };

  const getUserReviewCount = async (
    client: PocketBaseService,
  ): Promise<number> => {
    try {
      const reviews = await client.getList(
        "device_reviews",
        1,
        1,
        {
          filter: `user = "${user.id}"`,
          sort: "-created",
          expand: "",
        },
      );
      return reviews.totalItems ?? reviews.items.length ?? 0;
    } catch (error) {
      logJson("debug", "Failed to fetch user review count", {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  };

  const getUserReplyCount = async (
    client: PocketBaseService,
  ): Promise<number> => {
    try {
      const replies = await client.getList(
        "device_comment_replies",
        1,
        1,
        {
          filter: `user = "${user.id}"`,
          sort: "-created",
          expand: "",
        },
      );
      return replies.totalItems ?? replies.items.length ?? 0;
    } catch (error) {
      logJson("debug", "Failed to fetch user reply count", {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  };

  const getUserReactionCount = async (
    client: PocketBaseService,
  ): Promise<number> => {
    try {
      const reactions = await client.getList(
        "device_comment_reactions",
        1,
        1,
        {
          filter: `user = "${user.id}"`,
          sort: "-created",
          expand: "",
        },
      );
      return reactions.totalItems ?? reactions.items.length ?? 0;
    } catch (error) {
      logJson("debug", "Failed to fetch user reaction count", {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  };

  const getUnlockedAchievementIds = async (
    client: PocketBaseService,
  ): Promise<string[]> => {
    try {
      const result = await client.getList(
        "user_achievements",
        1,
        200,
        {
          filter: `user = "${user.id}"`,
          sort: "-created",
          expand: "",
        },
      );

      return (result?.items ?? []).map(
        (record: RecordModel & UserAchievementRecord) => record.achievement,
      );
    } catch (error) {
      logJson("debug", "User achievements collection unavailable", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  };

  const [
    collections,
    favoritedDevices,
    commentCount,
    reviewCount,
    replyCount,
    reactionCount,
    unlockedAchievementIds,
  ] = await Promise.all([
    getCollections(pbService),
    getFavoritedDevices(pbService),
    getUserCommentCount(pbService),
    getUserReviewCount(pbService),
    getUserReplyCount(pbService),
    getUserReactionCount(pbService),
    getUnlockedAchievementIds(pbService),
  ]);

  const ownedDeviceIds = new Set(
    collections.flatMap((collection) => collection.devices.map((d) => d.id)),
  );

  const achievements = buildAchievementBoard(
    {
      ownedDeviceCount: ownedDeviceIds.size,
      collectionCount: collections.length,
      favoritesCount: favoritedDevices.length,
      commentCount,
      reviewCount,
      commentReplyCount: replyCount,
      commentReactionCount: reactionCount,
    },
    unlockedAchievementIds,
  );

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
      "Player One",
      "Hero",
      "Continue",
      "Back for More",
      "Let's Go",
      "Back Online",
      "Link Established",
      "Respawned",
      "Insert Snacks",
      "Boot Complete",
      "Memory Card",
      "Retro XP",
      "Retro Vibes",
      "Handheld Dimension",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <div>
      <article>
        <header>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>
              {getWelcomeText()}, welcome {user.nickname}.
            </span>
          </h1>
        </header>

        {/* Achievements Section */}
        <section class="achievements-section">
          <div class="achievements-header">
            <h2>
              <PiTrophy /> Achievements
            </h2>
            <p class="achievements-subtitle">
              Collect playful emblems as you explore Retro Ranker.
            </p>
          </div>
          <div class="achievements-grid">
            {achievements.map((achievement) => (
              <article
                class={`achievement-card ${
                  achievement.unlocked ? "unlocked" : "locked"
                }`}
                key={achievement.id}
              >
                <div class="achievement-icon" aria-hidden="true">
                  {achievement.icon}
                </div>
                <div class="achievement-body">
                  <span class="achievement-category">
                    {achievement.category}
                  </span>
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                </div>
                <div class="achievement-progress">
                  <progress
                    max={achievement.threshold}
                    value={achievement.progress}
                  >
                  </progress>
                  <div class="achievement-progress-meta">
                    <span>{achievement.progressLabel}</span>
                    <span
                      class={`achievement-status ${
                        achievement.unlocked ? "is-unlocked" : ""
                      }`}
                    >
                      {achievement.statusText}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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
            Favorites
          </h2>

          {favoritedDevices.length === 0 && (
            <div class="empty-favorites-message">
              <p>No favorites yet</p>
              <p>
                Start exploring devices and add them to your favorites to see
                them here.
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
              Collections
            </h2>
            {collections.length > 0 && (
              <a
                href={`/collections/create`}
                role="button"
                type="button"
                class="button outline insert-btn create-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <PiPlus /> Create New
              </a>
            )}
          </div>

          {collections.length === 0 && (
            <div class="empty-collection-message">
              <p>
                No collections yet
              </p>
              <a
                href={`/collections/create`}
                role="button"
                class="outline insert-btn create-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  width: "fit-content",
                }}
              >
                <PiPlus />
                Create New
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
            <PiChatCentered /> Feedback
          </h2>
          <SuggestionForm csrfToken={csrfToken} />
        </section>

        <footer
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <SignOut
            buttonText="Sign Out"
            className="outline secondary"
          />
        </footer>
      </article>
    </div>
  );
}
