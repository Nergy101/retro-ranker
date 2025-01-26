import { Head } from "$fresh/runtime.ts";
import {
  PiCalendarHeart,
  PiRanking,
  PiSparkle,
  PiUserCheck,
} from "@preact-icons/pi";
import { DeviceCardSmall } from "../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../components/SeeMoreCard.tsx";
import { DeviceService } from "../services/devices/device.service.ts";
import { DeviceCardMedium } from "../components/DeviceCardMedium.tsx";

export default function Home() {
  // Filter devices into categories
  const deviceService = DeviceService.getInstance();
  const newArrivals = deviceService.getNewArrivals();
  const personalPicks = deviceService.getpersonalPicks();
  const highlyRated = deviceService.getHighlyRated();
  const upcoming = deviceService.getUpcoming();
  return (
    <div>
      <Head>
        <title>Retro Ranker - Home</title>
      </Head>

      <header>
        <hgroup style={{ textAlign: "center" }}>
          <p>
            Welcome to{" "}
          </p>
          <h1>
            <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span>.
          </h1>
          <p>
            Find the perfect device for your gaming needs.
          </p>
        </hgroup>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        class="container"
      >
        <div className="container">
          {/* New Arrivals Section */}
          <section style="margin-top: 2rem;">
            <h2 class="home-section-title">
              <PiSparkle /> New Arrivals
            </h2>
            <div class="device-row-grid">
              {newArrivals.map((device) => (
                <a href={`/devices/${device.name.sanitized}`}>
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

          {/* Highly Rated Section */}
          <section style="margin-top: 2rem;">
            <h2 class="home-section-title">
              <PiRanking /> Highly Rated
            </h2>
            <div class="device-row-grid">
              {highlyRated.map((device) => (
                <a href={`/devices/${device.name.sanitized}`}>
                  <DeviceCardMedium
                    device={device}
                    isActive={false}
                  />
                </a>
              ))}
              <SeeMoreCard
                href="/devices?sort=highly-rated"
                text="More Highly Rated"
              />
            </div>
          </section>

          {/* personal Picks Section */}
          <section style="margin-top: 2rem;">
            <h2 class="home-section-title">
              <PiUserCheck /> Personal Picks
            </h2>
            <div class="device-row-grid">
              {personalPicks.map((device) => (
                <a href={`/devices/${device.name.sanitized}`}>
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

          {/* Upcoming Section */}
          <section style="margin-top: 2rem;">
            <h2 class="home-section-title">
              <PiCalendarHeart /> Upcoming
            </h2>
            <div class="device-row-grid">
              {upcoming.map((device) => (
                <a href={`/devices/${device.name.sanitized}`}>
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
