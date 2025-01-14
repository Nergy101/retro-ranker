import { DeviceCardSmall } from "../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../components/SeeMoreCard.tsx";
import { getHighlyRated, getNewArrivals, getStaffPicks, getUpcoming } from "../data/device.service.ts";

export default function Home() {
  // Filter devices into categories
  const newArrivals = getNewArrivals();
  const staffPicks = getStaffPicks();
  const highlyRated = getHighlyRated();
  const upcoming = getUpcoming();
  return (
    <div>
      <main style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {/* New Arrivals Section */}
        <section>
          <h2>New Arrivals</h2>
          <div class="device-row-grid">
            {newArrivals.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices" />
          </div>
        </section>

        {/* Staff Picks Section */}
        <section style="margin-top: 2rem;">
          <h2>Staff Picks</h2>
          <div class="device-row-grid">
            {staffPicks.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices" />
          </div>
        </section>

        {/* Highly Rated Section */}
        <section style="margin-top: 2rem;">
          <h2>Highly Rated</h2>
          <div class="device-row-grid">
            {highlyRated.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices" />
          </div>
        </section>

        {/* Upcoming Section */}
        <section style="margin-top: 2rem;">
          <h2>Upcoming</h2>
          <div class="device-row-grid">
            {upcoming.map((device) => <DeviceCardSmall device={device} />)}
            <SeeMoreCard href="/devices" />
          </div>
        </section>
      </main>
    </div>
  );
}
