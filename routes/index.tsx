import {
  PiCalendar,
  PiChartLine,
  PiGitDiff,
  PiMagnifyingGlass,
  PiScroll,
} from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { SeeMoreCard } from "../components/cards/see-more-card.tsx";
import { TagComponent } from "../components/shared/tag-component.tsx";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { User } from "../data/frontend/contracts/user.contract.ts";
import { BrandWebsites } from "../data/frontend/enums/brand-websites.ts";
import { TagModel } from "../data/frontend/models/tag.model.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";
import { tracer } from "../data/tracing/tracer.ts";
import { CustomFreshState } from "../interfaces/state.ts";
import { DeviceCardMedium } from "../components/cards/device-card-medium.tsx";
import { Hero } from "../islands/hero.tsx";

export const handler = {
  async GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Browse and compare retro gaming handhelds",
      description:
        "Compare retro handhelds to find your perfect gaming device.",
      keywords:
        "retro gaming, handheld consoles, emulation devices, retro handhelds, gaming comparison, Anbernic, Miyoo, retro game emulation, portable gaming systems, retro gaming comparison",
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

    (ctx.state as CustomFreshState).data = {
      newArrivals,
      personalPicks,
      highlyRated,
      upcoming,
      defaultTags,
    };

    return await tracer.startActiveSpan("route:index", async (span) => {
      try {
        const user = (ctx.state as CustomFreshState)?.user as User | null;
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
  ctx: FreshContext,
) {
  const state = ctx.state as CustomFreshState;
  // const user = state.user as User | null;
  const data = state.data;

  const newArrivals = data.newArrivals as Device[];
  const personalPicks = data.personalPicks as Device[];
  const highlyRated = data.highlyRated as Device[];
  const upcoming = data.upcoming as Device[];
  const defaultTags = data.defaultTags as TagModel[];
  
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
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
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

          <section class="home-section">
            <article class="home-section-content">
              <h2 class="home-section-title">
                {/* <PiSparkle /> New Arrivals */}
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

          {/* Upcoming Section */}
          <section class="home-section">
            <article class="home-section-content">
              <h2 class="home-section-title">
                {/* <PiCalendarHeart /> Upcoming */}
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
                  href="/devices?filter=upcoming"
                  text="More Upcoming"
                />
              </div>
            </article>
          </section>

          {/* personal Picks Section */}
          <section class="home-section">
            <article class="home-section-content">
              <h2 class="home-section-title">
                {/* <PiUserCheck /> Personal Picks */}
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
                  href="/devices?filter=personal-picks"
                  text="More Personal Picks"
                />
              </div>
            </article>
          </section>

          {/* Highly Rated Section */}
          <section class="home-section">
            <article class="home-section-content">
              <h2 class="home-section-title">
                {/* <PiRanking /> */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  Highly Ranked
                  <span style={{ fontSize: "0.8rem" }}>($$)</span>
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
                  href="/devices?search=&page=1&tags=mid&sort=highly-ranked"
                  text="More Highly Ranked"
                />
              </div>
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
                  is a community-driven database of nearly 500{" "}
                  <strong>retro gaming handhelds</strong> from brands like{" "}
                  <a
                    href={BrandWebsites["anbernic"]}
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>Anbernic</strong>
                  </a>,{" "}
                  <a
                    href={BrandWebsites["retroid"]}
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>Retroid</strong>
                  </a>,{" "}
                  <a
                    href={BrandWebsites["miyoo-bittboy"]}
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>Miyoo</strong>
                  </a>,{" "}
                  <a
                    href={BrandWebsites["ayaneo"]}
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>Ayaneo</strong>
                  </a>,{" "}
                  <a
                    href={BrandWebsites["powkiddy"]}
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>Powkiddy</strong>
                  </a>{" "}
                  and many more. Whether you need an{" "}
                  <strong>affordable emulation device</strong> under $100 or a
                  {" "}
                  <strong>premium gaming handheld</strong>{" "}
                  for modern systems, our comprehensive comparison tools help
                  you find the perfect device for your needs.
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
