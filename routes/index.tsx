import { DeviceCardSmall } from "../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../components/SeeMoreCard.tsx";
import { DeviceService } from "../data/devices/device.service.ts";

export default function Home() {
  // Filter devices into categories
  const deviceService = DeviceService.getInstance();
  const newArrivals = deviceService.getNewArrivals();
  const staffPicks = deviceService.getStaffPicks();
  const highlyRated = deviceService.getHighlyRated();
  const upcoming = deviceService.getUpcoming();
  return (
    <div>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Welcome to <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span></h1>
          <p>
            Find the perfect device for your gaming needs.
          </p>
        </hgroup>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* New Arrivals Section */}
        <section>
          <h2>New Arrivals</h2>
          <div class="device-row-grid">
            {newArrivals.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices?sort=new-arrivals" />
          </div>
        </section>

        {/* Staff Picks Section */}
        <section style="margin-top: 2rem;">
          <h2>Staff Picks</h2>
          <div class="device-row-grid">
            {staffPicks.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices?sort=staff-picks" />
          </div>
        </section>

        {/* Highly Rated Section */}
        <section style="margin-top: 2rem;">
          <h2>Highly Rated</h2>
          <div class="device-row-grid">
            {highlyRated.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices?sort=highly-rated" />
          </div>
        </section>

        {/* Upcoming Section */}
        <section style="margin-top: 2rem;">
          <h2>Upcoming</h2>
          <div class="device-row-grid">
            {upcoming.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices?sort=upcoming" />
          </div>
        </section>
      </main>
    </div>
  );
}
