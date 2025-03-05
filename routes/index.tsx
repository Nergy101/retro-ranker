import { PageProps } from "$fresh/server.ts";
import {
  PiCalendar,
  PiCalendarHeart,
  PiGitDiff,
  PiRanking,
  PiScroll,
  PiSparkle,
  PiTag,
  PiTagChevron,
  PiUserCheck,
} from "@preact-icons/pi";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { SeeMoreCard } from "../components/cards/SeeMoreCard.tsx";
import SEO from "../components/SEO.tsx";
import { TagComponent } from "../components/shared/TagComponent.tsx";
import { TagModel } from "../data/models/tag.model.ts";
import { DeviceService } from "../services/devices/device.service.ts";

export default function Home({ url }: PageProps) {
  // Filter devices into categories
  const deviceService = DeviceService.getInstance();
  const newArrivals = deviceService.getNewArrivals();
  const personalPicks = deviceService.getpersonalPicks();
  const highlyRated = deviceService.getHighlyRated();
  const upcoming = deviceService.getUpcoming();

  const defaultTags = [
    deviceService.getTagBySlug("low"),
    deviceService.getTagBySlug("mid"),
    deviceService.getTagBySlug("high"),
    deviceService.getTagBySlug("oled"),
    deviceService.getTagBySlug("year-2024"),
    deviceService.getTagBySlug("year-2025"),
    deviceService.getTagBySlug("upcoming"),
    deviceService.getTagBySlug("anbernic"),
    deviceService.getTagBySlug("miyoo-bittboy"),
    deviceService.getTagBySlug("ayaneo"),
    deviceService.getTagBySlug("powkiddy"),
    deviceService.getTagBySlug("clamshell"),
    deviceService.getTagBySlug("horizontal"),
    deviceService.getTagBySlug("vertical"),
    deviceService.getTagBySlug("micro"),
    deviceService.getTagBySlug("windows"),
    deviceService.getTagBySlug("steam-os"),
    deviceService.getTagBySlug("linux"),
    deviceService.getTagBySlug("android"),
    deviceService.getTagBySlug("personal-pick"),
  ].filter((tag) => tag !== null) as TagModel[];

  return (
    <div class="home-page">
      <SEO
        title="Retro Ranker"
        description="Find the perfect retro handheld gaming device for your needs. Compare specs, prices, and performance of the latest emulation handhelds from Anbernic, Miyoo, and more."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro gaming, handheld consoles, emulation devices, retro handhelds, gaming comparison, Anbernic, Miyoo, retro game emulation, portable gaming systems, retro gaming comparison"
      />
      <header class="home-header">
        <hgroup style={{ textAlign: "center" }}>
          <p>
            Welcome to
          </p>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span>
          </h1>
          <p>
            Find the handheld gaming device for your needs.
          </p>
        </hgroup>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div class="container-fluid">
          <section
            class="site-introduction"
            style={{
              marginBottom: "2rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                flex: "1 1 500px",
                textAlign: "left",
                minWidth: "300px",
              }}
            >
              <h2
                style={{ color: "var(--pico-contrast)", marginBottom: "1rem" }}
              >
                Community-Powered Retro Gaming Resource
              </h2>
              <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                Welcome to Retro Ranker, a community-made site dedicated to
                retro gaming handhelds. Thanks to our community-maintained
                database containing nearly 500 devices, you can easily discover
                and compare the perfect handheld for your gaming needs.
              </p>
              <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                Whether you're looking for budget-friendly options under $100,
                mid-range devices with excellent emulation capabilities, or
                high-end powerhouses that can run every system, our
                comprehensive collection of handhelds has you covered.
              </p>
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="/devices"
                  class="button primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PiScroll /> Browse Devices
                </a>
                <a
                  href="/compare"
                  class="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PiGitDiff /> Compare Devices
                </a>
                <a
                  href="/release-timeline"
                  class="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PiCalendar /> Release Timeline
                </a>
              </div>
            </div>

            <div style={{ flex: "0 1 350px", minWidth: "300px" }}>
              <div
                style={{
                  background: "var(--pico-card-background-color)",
                  padding: "1rem",
                  borderRadius: "var(--pico-border-radius)",
                  boxShadow: "var(--pico-card-box-shadow)",
                }}
              >
                <h3
                  style={{
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    color: "var(--pico-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PiTag /> Popular Tags
                </h3>

                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {defaultTags.map((tag) => (
                    <TagComponent
                      key={tag.name}
                      tag={tag}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <hr />

          {/* New Arrivals Section */}
          <section class="home-section">
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
          </section>

          {/* personal Picks Section */}
          <section class="home-section">
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
                href="/devices?filter=personal-picks"
                text="More Personal Picks"
              />
            </div>
          </section>

          {/* Highly Rated Section */}
          <section class="home-section">
            <h2 class="home-section-title">
              <PiRanking />
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                Highly Ranked
                <span style={{ fontSize: "0.8rem" }}>(mid-range)</span>
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
                href="/devices?sort=highly-ranked"
                text="More Highly Ranked"
              />
            </div>
          </section>

          {/* Upcoming Section */}
          <section class="home-section">
            <h2 class="home-section-title">
              <PiCalendarHeart /> Upcoming
            </h2>
            <div class="device-row-grid">
              {upcoming.map((device) => (
                <a
                  href={`/devices/${device.name.sanitized}`}
                  style={{ textDecoration: "none" }}
                >
                  <DeviceCardMedium device={device} isActive={false} />
                </a>
              ))}
              <SeeMoreCard
                href="/devices?filter=upcoming"
                text="More Upcoming"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
