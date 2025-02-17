import { Head } from "$fresh/runtime.ts";
import {
  PiCalendarHeart,
  PiRanking,
  PiSparkle,
  PiUserCheck,
} from "@preact-icons/pi";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { SeeMoreCard } from "../components/cards/SeeMoreCard.tsx";
import { TagComponent } from "../components/shared/TagComponent.tsx";
import { TagModel } from "../data/models/tag.model.ts";
import { DeviceService } from "../services/devices/device.service.ts";

export default function Home() {
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
    deviceService.getTagBySlug("year-2024"),
    deviceService.getTagBySlug("year-2025"),
    deviceService.getTagBySlug("anbernic"),
    deviceService.getTagBySlug("miyoo-bittboy"),
    deviceService.getTagBySlug("clamshell"),
    deviceService.getTagBySlug("horizontal"),
    deviceService.getTagBySlug("vertical"),
    deviceService.getTagBySlug("micro"),
  ].filter((tag) => tag !== null) as TagModel[];

  return (
    <div class="home-page">
      <Head>
        <title>Retro Ranker - Home</title>
      </Head>

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
          <div class="tags">
            {defaultTags.map((tag) => <TagComponent tag={tag} />)}
          </div>
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
