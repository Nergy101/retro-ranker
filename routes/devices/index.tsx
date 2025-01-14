import { PageProps } from "$fresh/server.ts";
import { getAllDevices } from "../../data/device.service.ts";
import { DeviceCardMedium } from "../../components/DeviceCardMedium.tsx";

export default function DevicesIndex(props: PageProps) {
  const devices = getAllDevices();
  const searchQuery = props.url.searchParams.get("search") || "";

  const getFilteredDevices = () => {
    if (!devices) return [];

    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return devices.slice(-10); // Show latest 10 devices when no search
    }

    return devices
      .filter((device) => (
        device.name.toLowerCase().includes(query) ||
        device.brand.toLowerCase().includes(query)
      ))
      .slice(0, 10);
  };

  return (
    <div>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Device Catalog</h1>
          <p>Currently indexed {devices.length} devices</p>
        </hgroup>
      </header>
      <form role="search" method="get">
        <input
          name="search"
          type="search"
          placeholder="Search devices..."
          value={searchQuery}
          aria-label="Search devices"
        />
        <input type="submit" value="Search" />
      </form>

      <div class="device-search-grid">
        {getFilteredDevices().map((device) => <DeviceCardMedium device={device} />)}
      </div>
    </div>
  );
}
