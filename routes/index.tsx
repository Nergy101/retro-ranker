import { DeviceCardMedium } from "../components/cards/device-card-medium.tsx";
import { SeeMoreCard } from "../components/cards/see-more-card.tsx";
import { TagComponent } from "../components/shared/tag-component.tsx";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { User } from "../data/frontend/contracts/user.contract.ts";
import { TagModel } from "../data/frontend/models/tag.model.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";
import { tracer } from "../data/tracing/tracer.ts";
import { State } from "../utils.ts";
import { Hero } from "../islands/hero/hero.tsx";
import {
  PiCalendar,
  PiChartLine,
  PiGitDiff,
  PiMagnifyingGlass,
  PiRanking,
  PiScroll,
  PiSparkle,
  PiUserCheck,
} from "@preact-icons/pi";
import { Context, page } from "fresh";
import { OperatingSystemDistribution } from "../islands/charts/os-distribution.tsx";
import { DevicesPerReleaseYearLineChart } from "../islands/charts/devices-per-release-year-line-chart.tsx";

export const handler = {
  async GET(ctx: Context<State>) {
    ctx.state.seo = {
      title: "Retro Gaming Handheld Database & Reviews | Retro Ranker",
      description:
        "Discover the ultimate retro gaming handheld database. Compare specs, read reviews, and find your perfect portable emulation device. Browse 400+ devices from Anbernic, Miyoo, Steam Deck, and more.",
      keywords:
        "retro gaming handhelds, emulation devices, portable gaming, retro console comparison, handheld reviews, Anbernic, Miyoo, Steam Deck, retro gaming database, handheld specs, emulation performance, retro gaming community",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };

    const deviceService = await DeviceService.getInstance();
    const newArrivals = await deviceService.getNewArrivals();
    const personalPicks = await deviceService.getPersonalPicks();
    const highlyRated = await deviceService.getHighlyRated();
    const upcoming = await deviceService.getUpcoming();

    const defaultTags = [
      await deviceService.getTagBySlug("low"),
      await deviceService.getTagBySlug("mid"),
      await deviceService.getTagBySlug("high"),
      await deviceService.getTagBySlug("oled"),
      await deviceService.getTagBySlug("year-2024"),
      await deviceService.getTagBySlug("year-2025"),
      await deviceService.getTagBySlug("upcoming"),
      await deviceService.getTagBySlug("anbernic"),
      await deviceService.getTagBySlug("miyoo-bittboy"),
      await deviceService.getTagBySlug("ayaneo"),
      await deviceService.getTagBySlug("powkiddy"),
      await deviceService.getTagBySlug("clamshell"),
      await deviceService.getTagBySlug("horizontal"),
      await deviceService.getTagBySlug("vertical"),
      await deviceService.getTagBySlug("micro"),
      await deviceService.getTagBySlug("windows"),
      await deviceService.getTagBySlug("steam-os"),
      await deviceService.getTagBySlug("linux"),
      await deviceService.getTagBySlug("android"),
      await deviceService.getTagBySlug("personal-pick"),
    ].filter((tag) => tag !== null) as TagModel[];

    // Likes and favorites data
    // const deviceIds = [
    //   ...newArrivals,
    //   ...personalPicks,
    //   ...highlyRated,
    //   ...upcoming,
    // ].map((d) => d.id);
    // const pb = await createSuperUserPocketBaseService(
    //   Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
    //   Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
    //   Deno.env.get("POCKETBASE_URL")!,
    // );

    // const likesFilter = deviceIds.map((id) => `device="${id}"`).join(" || ");
    // const likeRecords = deviceIds.length > 0
    //   ? await pb.getAll("device_likes", {
    //     filter: likesFilter,
    //     expand: "",
    //     sort: "",
    //   })
    //   : [];
    // const likesCountMap: Record<string, number> = {};
    // const userLikedMap: Record<string, boolean> = {};
    // const currentUser = ctx.state.user as User | null;
    // for (const r of likeRecords) {
    //   likesCountMap[r.device] = (likesCountMap[r.device] || 0) + 1;
    //   if (currentUser && r.user === currentUser.id) {
    //     userLikedMap[r.device] = true;
    //   }
    // }

    // const favoritesFilter = currentUser
    //   ? `user="${currentUser.id}" && (` +
    //     deviceIds.map((id) => `device="${id}"`).join(" || ") +
    //     ")"
    //   : "";
    // const favoriteRecords = currentUser && deviceIds.length > 0
    //   ? await pb.getAll("device_favorites", {
    //     filter: favoritesFilter,
    //     expand: "",
    //     sort: "",
    //   })
    //   : [];
    // const userFavoritedMap: Record<string, boolean> = {};
    // for (const r of favoriteRecords) {
    //   userFavoritedMap[r.device] = true;
    // }

    const devices = await deviceService.getAllDevices();

    ctx.state.data = {
      devices,
      newArrivals,
      personalPicks,
      highlyRated,
      upcoming,
      defaultTags,
      // likesCountMap,
      // userLikedMap,
      // userFavoritedMap,
      // user: ctx.state.user,
    };

    return await tracer.startActiveSpan("route:index", async (span: any) => {
      try {
        const user = ctx.state?.user as User | null;
        span.setAttribute("user.authenticated", !!user);
        if (user && "email" in user) {
          span.setAttribute("user.email", user.email);
        }

        const result = page(ctx);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    });
  },
};

export default function Home(
  ctx: Context<State>,
) {
  const state = ctx.state;
  const data = state.data;
  const devices = data.devices as Device[];
  const newArrivals = data.newArrivals as Device[];
  const personalPicks = data.personalPicks as Device[];
  const highlyRated = data.highlyRated as Device[];
  const upcoming = data.upcoming as Device[];
  const defaultTags = data.defaultTags as TagModel[];
  // const user = data.user as User | null;
  // const likesCountMap = data.likesCountMap as Record<string, number>;
  // const userLikedMap = data.userLikedMap as Record<string, boolean>;
  // const userFavoritedMap = data.userFavoritedMap as Record<string, boolean>;

  return (
    <div class="home-page">
      <Hero />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div class="container-fluid">
          <section>
            <article class="popular-searches-container">
              <h3
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--pico-card-background-color-darker)",
                  padding: "0.5rem",
                  maxWidth: "20em",
                  borderRadius: "var(--pico-border-radius)",
                }}
              >
                <PiMagnifyingGlass /> Popular Searches
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {defaultTags.map((tag) => (
                  <TagComponent
                    key={tag.name}
                    tag={tag}
                  />
                ))}
              </div>
            </article>
          </section>

          <hr />

          {/* Upcoming Section */}
          {upcoming.length > 0
            ? (
              <section class="home-section">
                <article class="home-section-content">
                  <h2 class="home-section-title">
                    <PiCalendar /> Upcoming
                  </h2>
                  <div class="device-row-grid">
                    {upcoming.map((device) => (
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
                    <SeeMoreCard
                      href="/devices?tags=upcoming"
                      text="More Upcoming"
                    />
                  </div>
                </article>
              </section>
            )
            : null}

          {newArrivals.length > 0
            ? (
              <section class="home-section">
                <article class="home-section-content">
                  <h2 class="home-section-title">
                    <PiSparkle /> New Arrivals
                  </h2>
                  <div class="device-row-grid">
                    {newArrivals.map((device) => (
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
                    <SeeMoreCard
                      href="/devices?sort=new-arrivals"
                      text="More New Arrivals"
                    />
                  </div>
                </article>
              </section>
            )
            : null}

          {/* Highly Rated Section */}
          {highlyRated.length > 0
            ? (
              <section class="home-section">
                <article class="home-section-content">
                  <h2 class="home-section-title">
                    <PiRanking /> Bang for your buck
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem" }}>
                        ($$)
                      </span>
                    </div>
                  </h2>
                  <div class="device-row-grid">
                    {highlyRated.map((device) => (
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
                    <SeeMoreCard
                      href="/devices?tags=mid&sort=highly-ranked"
                      text="More Highly Ranked"
                    />
                  </div>
                </article>
              </section>
            )
            : null}

          {/* personal Picks Section */}
          {personalPicks.length > 0
            ? (
              <section class="home-section">
                <article class="home-section-content">
                  <h2 class="home-section-title">
                    <PiUserCheck /> Personal Picks
                  </h2>
                  <div class="device-row-grid">
                    {personalPicks.map((device) => (
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
                    <SeeMoreCard
                      href="/devices?tags=personal-pick"
                      text="More Personal Picks"
                    />
                  </div>
                </article>
              </section>
            )
            : null}

          <hr />
          <section class="site-charts-showcase">
            <article class="site-charts-showcase-content">
              <h2
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <PiChartLine /> Charts & Analytics
              </h2>
              <p>
                This is a showcase of some of the charts about the current state
                of devices. <br /> <a href="/charts">View all charts here.</a>
              </p>
              <hr />
              {devices.length > 0
                ? (
                  <>
                    <div class="chart-wrapper" style={{ marginBottom: "1rem" }}>
                      <DevicesPerReleaseYearLineChart
                        devices={devices}
                      />
                    </div>
                    <div class="chart-wrapper" style={{ marginBottom: "1rem" }}>
                      <OperatingSystemDistribution
                        devices={devices}
                      />
                    </div>
                  </>
                )
                : null}
            </article>
          </section>
          <hr />
          <section class="site-introduction">
            <article class="site-introduction-content">
              <div class="site-introduction-text">
                <hgroup>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--pico-contrast)",
                      textAlign: "center",
                    }}
                  >
                    A Handheld Database
                  </h2>
                  <p style={{ textAlign: "center" }}>
                    Powered by the Retro Handhelds community
                  </p>
                </hgroup>

                <p
                  style={{
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                    textAlign: "center",
                  }}
                >
                  <strong style={{ color: "var(--pico-primary)" }}>
                    Retro Ranker {" "}
                  </strong>
                  is a comprehensive database of retro gaming handhelds,
                  designed to help you find the perfect device for your gaming
                  needs. Whether you're a seasoned collector or just getting
                  started, our platform provides detailed specifications,
                  performance ratings, and user reviews to guide your decision.
                </p>
                <div class="index-buttons">
                  <a
                    role="button"
                    class="button outline"
                    href="/devices"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      color: "var(--pico-contrast)",
                    }}
                  >
                    <PiScroll /> Devices
                  </a>
                  <a
                    href="/compare"
                    role="button"
                    class="button outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      color: "var(--pico-contrast)",
                    }}
                  >
                    <PiGitDiff /> Compare
                  </a>

                  <a
                    href="/release-timeline"
                    role="button"
                    class="button outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      color: "var(--pico-contrast)",
                    }}
                  >
                    <PiCalendar /> Releases
                  </a>

                  <a
                    href="/charts"
                    role="button"
                    class="button outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      color: "var(--pico-contrast)",
                    }}
                  >
                    <PiChartLine /> Charts
                  </a>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
