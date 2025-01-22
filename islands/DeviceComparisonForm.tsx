import { useSignal } from "@preact/signals";
import { Device } from "../data/models/device.model.ts";


export function DeviceComparisonForm({ allDevices }: { allDevices: Device[] }) {
  const queryA = useSignal("");
  const queryB = useSignal("");
  const suggestionsA = useSignal<Device[]>([]);
  const suggestionsB = useSignal<Device[]>([]);

  const setQueryA = (value: string) => {
    queryA.value = value;
    suggestionsA.value = allDevices.filter(device =>
      device.name.raw.toLowerCase().includes(value.toLowerCase())
    );
  };

  const setQueryASuggestion = (value: string) => {
    queryA.value = value;
    suggestionsA.value = [];
  };

  const setQueryB = (value: string) => {
    queryB.value = value;
    suggestionsB.value = allDevices.filter(device =>
      device.name.raw.toLowerCase().includes(value.toLowerCase())
    );
  };

  const setQueryBSuggestion = (value: string) => {
    queryB.value = value;
    suggestionsB.value = [];
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const selectedDeviceA = allDevices.find(device => device.name.raw === queryA.value);
    const selectedDeviceB = allDevices.find(device => device.name.raw === queryB.value);

    if (selectedDeviceA && selectedDeviceB) {
      const sanitizedA = selectedDeviceA.name.sanitized;
      const sanitizedB = selectedDeviceB.name.sanitized;
      globalThis.location.href = `/compare?devices=${sanitizedA},${sanitizedB}`;
    } else {
      alert("Please select valid devices for comparison.");
    }
  };

  const handleReset = (event: Event) => {
    event.preventDefault();
    globalThis.location.href = "/compare";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ width: "100%" }}>
          <span>Device A</span>
          <input
            type="text"
            value={queryA.value}
            onInput={(e) => setQueryA(e.currentTarget.value)}
            placeholder="Search for a device..."
            aria-label="Search devices"
          />
          <ul class="suggestions-list">
            {suggestionsA.value.map(device => (
              <li
                key={device.id}
                onClick={() => setQueryASuggestion(device.name.raw)}
                class="suggestions-list-item"
              >
                {device.name.raw}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "100%" }}>
          <span>Device B</span>
          <input
            type="text"
            value={queryB.value}
            onInput={(e) => setQueryB(e.currentTarget.value)}
            placeholder="Search for a device..."
            aria-label="Search devices"
          />
          <ul class="suggestions-list">
            {suggestionsB.value.map(device => (
              <li
                key={device.id}
                onClick={() => setQueryBSuggestion(device.name.raw)}
                class="suggestions-list-item"
              >
                {device.name.raw}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="reset" onClick={handleReset}>Reset</button>
        <button type="submit">Compare</button>
      </div>
    </form>
  );
}
