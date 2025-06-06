import { FreshContext, page } from "fresh";
import { DeviceCardLarge } from "../components/cards/device-card-large.tsx";
import { DeviceCardSmall } from "../components/cards/device-card-small.tsx";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { ReviewContract } from "../data/frontend/contracts/review.contract.ts";
import { createSuperUserPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "../interfaces/state.ts";

export const handler = {
  async GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Leaderboard",
      description: "Retro Ranker - Leaderboard - Top Rated Handhelds",
      keywords:
        "leaderboard, top rated handhelds, retro gaming, handheld devices, user reviews",
    };
    // Instantiate PocketBase with admin credentials
    const pb = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );

    // Fetch all reviews
    const allReviews = await pb.getAll("device_reviews", {
      filter: "",
      expand: "device",
      sort: "",
    });

    const devices = allReviews.map((r) => r.expand.device.deviceData);

    // Group reviews by device
    const reviewsByDevice: Record<string, ReviewContract[]> = {};
    for (const review of allReviews) {
      if (!reviewsByDevice[review.device]) {
        reviewsByDevice[review.device] = [];
      }
      reviewsByDevice[review.device].push(review);
    }

    // Calculate average total score for each device
    const deviceScores = devices.map((device) => {
      const reviews = reviewsByDevice[device.id] || [];
      // List of all rating fields to include
      const ratingFields = [
        "performance_rating",
        "monitor_rating",
        "audio_rating",
        "controls_rating",
        "misc_rating",
        "connectivity_rating",
        "overall_rating",
      ];
      // Gather all ratings for this device
      const allRatings: number[] = [];
      for (const review of reviews) {
        for (const field of ratingFields) {
          const value = review[field as keyof typeof review];
          if (typeof value === "number" && !isNaN(value)) {
            allRatings.push(value);
          }
        }
      }
      const avgScore = allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
        : null;
      return {
        device,
        avgScore,
      };
    });

    // Only include devices with at least one review
    const scoredDevices = deviceScores.filter((d) => d.avgScore !== null);

    // Sort by average score descending
    scoredDevices.sort((a, b) => (b.avgScore! - a.avgScore!));

    // Top 3 and the rest
    const top3 = scoredDevices.slice(0, 3);
    const rest = scoredDevices.slice(3);

    (ctx.state as CustomFreshState).data = {
      top3,
      rest,
    };

    return page(ctx);
  },
};

export default function LeaderboardPage(
  ctx: FreshContext,
) {
  const data = (ctx.state as CustomFreshState).data as {
    top3: { device: Device; avgScore: number }[];
    rest: { device: Device; avgScore: number }[];
  };

  return (
    <div class="leaderboard-page">
      {
        /* <SEO
        title="Leaderboard - Top Rated Handhelds"
        description="See the top rated retro handhelds based on user reviews."
        url="https://retroranker.site/leaderboard"
      /> */
      }
      <div>
        <h1>Leaderboard</h1>
        <p>
          The leaderboard is a list of the top rated retro handheld devices{" "}
          <br />
          based on reviews from users like you!
        </p>
        <img
          src="/images/rr-medal.png"
          alt="Leaderboard"
          class="leaderboard-medal"
        />
        {/* Arrange top3: 1st (center, highest), 2nd (left), 3rd (right, lowest) */}
        <div
          class="leaderboard-top3-row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "2rem",
          }}
        >
          {/* 1st place - center, highest */}
          <div
            class="leaderboard-top3-item leaderboard-top3-item-1"
            style={{ flex: 1, minWidth: 0, marginBottom: "5rem" }}
          >
            <div
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {data.top3[0]?.avgScore.toFixed(2)} / 10
            </div>
            <div class="leaderboard-rank">#1</div>
            <a href={`/devices/${data.top3[0]?.device.id}`}>
              <DeviceCardLarge
                device={{
                  ...data.top3[0]?.device,
                  totalRating: data.top3[0]?.avgScore,
                }}
              />
            </a>
          </div>
          {/* 2nd place - left */}
          <div
            class="leaderboard-top3-item leaderboard-top3-item-2"
            style={{ flex: 1, minWidth: 0, marginBottom: "2.5rem" }}
          >
            <div
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {data.top3[1]?.avgScore.toFixed(2)} / 10
            </div>
            <div class="leaderboard-rank">#2</div>
            <a href={`/devices/${data.top3[1]?.device.id}`}>
              <DeviceCardLarge
                device={{
                  ...data.top3[1]?.device,
                  totalRating: data.top3[1]?.avgScore,
                }}
              />
            </a>
          </div>
          {/* 3rd place - right, lowest */}
          <div
            class="leaderboard-top3-item leaderboard-top3-item-3"
            style={{ flex: 1, minWidth: 0, marginBottom: 0 }}
          >
            <div
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {data.top3[2]?.avgScore.toFixed(2)} / 10
            </div>
            <div class="leaderboard-rank">#3</div>
            <a href={`/devices/${data.top3[2]?.device.id}`}>
              <DeviceCardLarge
                device={{
                  ...data.top3[2]?.device,
                  totalRating: data.top3[2]?.avgScore,
                }}
              />
            </a>
          </div>
        </div>
      </div>
      <div>
        <h2 style={{ textAlign: "center" }}>
          More Ranked Handhelds
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {data.rest.map(({ device, avgScore }, idx) => (
            <div>
              <a href={`/devices/${device.id}`}>
                <DeviceCardSmall
                  device={{ ...device, totalRating: avgScore }}
                />
              </a>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "0.25rem",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {avgScore.toFixed(2)} / 10
              </div>
              <div style={{ textAlign: "center", color: "#aaa" }}>
                #{idx + 4}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
