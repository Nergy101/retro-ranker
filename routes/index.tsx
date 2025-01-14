import { getAllDevices } from "../data/device.service.ts";
import { DeviceCardSmall } from "../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../components/SeeMoreCard.tsx";

export default async function Home() {
  const allDevices = await getAllDevices();
  // Filter devices into categories
  const newArrivals = allDevices.slice(0, 4);
  const staffPicks = allDevices.slice(4, 8);

  const highlyRated = allDevices.filter((device) =>
    device.performanceRating.rating === 5
  )
    .sort((a, b) => b.released.localeCompare(a.released))
    .slice(0, 4);

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
      </main>
    </div>
  );
}
