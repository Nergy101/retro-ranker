import { PageProps } from "$fresh/server.ts";
import {
  PiCalendar,
  PiCalendarHeart,
  PiGitDiff,
  PiMagnifyingGlass,
  PiRanking,
  PiScroll,
  PiSparkle,
  PiUserCheck,
} from "@preact-icons/pi";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { SeeMoreCard } from "../components/cards/SeeMoreCard.tsx";
import SEO from "../components/SEO.tsx";
import { TagComponent } from "../components/shared/TagComponent.tsx";
import { BrandWebsites } from "../data/frontend/enums/brand-websites.ts";
import { TagModel } from "../data/frontend/models/tag.model.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";

export default function Home({ url }: PageProps) {
  // Filter devices into categories
  const deviceService = DeviceService.getInstance();
  const newArrivals = deviceService.getNewArrivals();
  const personalPicks = deviceService.getPersonalPicks();
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
        title="Browse and compare retro gaming handhelds"
        description="Compare retro handhelds to find your perfect gaming device."
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
          <section class="site-introduction">
            <article class="site-introduction-content">
              <div class="site-introduction-text">
                <hgroup>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--pico-contrast)",
                    }}
                  >
                    Retro Handheld Resource
                  </h2>
                  <p>
                    Powered by the community
                  </p>
                </hgroup>

                <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                  Welcome to{" "}
                  <strong>Retro Ranker</strong>, the community-driven database
                  of nearly 500 <strong>retro gaming handhelds</strong>{" "}
                  from brands like{" "}
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
                    class="button contrast outline"
                    href="/devices"
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
                    role="button"
                    class="button contrast outline"
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
                    role="button"
                    class="button contrast outline"
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

              <div class="popular-searches-container">
                <h3
                  style={{
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <PiMagnifyingGlass /> Popular Searches
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
            </article>
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
