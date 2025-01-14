import { useSignal } from "@preact/signals";
import DeviceCardMedium from "../components/DeviceCardMedium.tsx";
import { Device } from "../data/device.model.ts";

interface DeviceSearchProps {
  initialDevices: Device[];
  initialQuery: string;
}

export default function DeviceSearch({ initialDevices, initialQuery }: DeviceSearchProps) {
  const devices = useSignal(initialDevices);
  const searchQuery = useSignal(initialQuery);
  const debouncedSearchTimeout = useSignal<number | null>(null);

  const getFilteredDevices = () => {
    if(!devices.value) return [];

    const query = searchQuery.value.toLowerCase().trim();
    
    if (!query) {
      return devices.value.slice(-10); // Show latest 10 devices when no search
    }

    return devices.value
      .filter((device) => (
        device.name.toLowerCase().includes(query) ||
        device.brand.toLowerCase().includes(query)
      ))
      .slice(0, 10);
  };

  const handleSearch = (e: Event) => {
    const input = e.target as HTMLInputElement;
    
    if (debouncedSearchTimeout.value) {
      clearTimeout(debouncedSearchTimeout.value);
    }

    debouncedSearchTimeout.value = setTimeout(() => {
      searchQuery.value = input.value;
    }, 300) as unknown as number;
  };

  const renderDeviceCard = (device: Device) => (
    <DeviceCardMedium device={device} />
  );

  return (
    <div>
      <header>
        <h1>Device Catalog</h1>
        <input
          type="search"
          placeholder="Search devices..."
          value={searchQuery.value}
          onInput={handleSearch}
          aria-label="Search devices"
        />
      </header>

      <div class="device-search-grid">
        {getFilteredDevices().map(renderDeviceCard)}
      </div>
    </div>
  );
}
