import { PiGitDiff } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Device } from "../data/models/device.model.ts";
import { DeviceCardSmall } from "../components/DeviceCardSmall.tsx";
import { DeviceCardMedium } from "../components/DeviceCardMedium.tsx";

export function DeviceComparisonForm({
  allDevices,
  devicesToCompare,
}: {
  allDevices: Device[];
  devicesToCompare: Device[];
}) {
  const queryA = useSignal(devicesToCompare?.[0]?.name.raw || "");
  const queryB = useSignal(devicesToCompare?.[1]?.name.raw || "");
  const suggestionsA = useSignal<Device[]>([]);
  const suggestionsB = useSignal<Device[]>([]);
  const suggestionsARef = useRef<HTMLUListElement>(null);
  const suggestionsBRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsARef.current &&
        !suggestionsARef.current.contains(event.target as Node)
      ) {
        suggestionsA.value = [];
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsBRef.current &&
        !suggestionsBRef.current.contains(event.target as Node)
      ) {
        suggestionsB.value = [];
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const setQueryA = (value: string) => {
    queryA.value = value;
    suggestionsA.value = allDevices.filter((device) =>
      device.name.raw.toLowerCase().includes(value.toLowerCase()) ||
      device.brand.toLowerCase().includes(value.toLowerCase())
    );
  };

  const setQueryASuggestion = (value: string) => {
    queryA.value = value;
    suggestionsA.value = [];
  };

  const setQueryB = (value: string) => {
    queryB.value = value;
    suggestionsB.value = allDevices.filter((device) =>
      device.name.raw.toLowerCase().includes(value.toLowerCase()) ||
      device.brand.toLowerCase().includes(value.toLowerCase())
    );
  };

  const setQueryBSuggestion = (value: string) => {
    queryB.value = value;
    suggestionsB.value = [];
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const selectedDeviceA = allDevices.find((device) =>
      device.name.raw === queryA.value
    );
    const selectedDeviceB = allDevices.find((device) =>
      device.name.raw === queryB.value
    );

    if (selectedDeviceA && selectedDeviceB) {
      const sanitizedA = selectedDeviceA.name.sanitized;
      const sanitizedB = selectedDeviceB.name.sanitized;
      globalThis.location.href = `/compare?devices=${sanitizedA},${sanitizedB}`;
    } else {
      alert("Select valid devices for comparison.");
    }
  };

  const handleReset = () => {
    globalThis.location.href = "/compare";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          marginBottom: "1rem",
          flexDirection: "column",
          containerType: "inline-size",
        }}
      >
        <div class="compare-form-inputs">
          <div style={{ width: "100%" }}>
            <span>Device A</span>
            <input
              type="search"
              value={queryA.value}
              onInput={(e) => setQueryA(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
            />
          </div>
          <div style={{ width: "100%" }}>
            <span>Device B</span>
            <input
              type="search"
              value={queryB.value}
              onInput={(e) => setQueryB(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
            />
          </div>
        </div>
        <div>
          {suggestionsA.value.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsARef}>
              {suggestionsA.value.map((device) => (
                <li
                  key={device.id}
                  onClick={() => setQueryASuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium device={device} />
                </li>
              ))}
            </ul>
          )}
          {suggestionsB.value.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsBRef}>
              {suggestionsB.value.map((device) => (
                <li
                  key={device.id}
                  onClick={() => setQueryBSuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium device={device} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="reset" onClick={handleReset}>Reset</button>
        <button
          type="submit"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={!queryA.value || !queryB.value}
        >
          <PiGitDiff />
          Compare selected devices
        </button>
      </div>
    </form>
  );
}
