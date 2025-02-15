import { PiGitDiff } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/device.model.ts";

export function DeviceComparisonForm({
  allDevices,
  devicesToCompare,
  similarDevices,
}: {
  allDevices: Device[];
  devicesToCompare: Device[];
  similarDevices: Device[];
}) {
  const originalDeviceA = devicesToCompare?.[0];
  const originalDeviceB = devicesToCompare?.[1];

  const allDeviceRawNames = allDevices.map((device) => device.name.raw);
  const deviceNameIsInvalid = (deviceName: string) =>
    !allDeviceRawNames.some((name) =>
      name.toLowerCase() === deviceName.toLowerCase()
    );

  const [queryA, setQueryA] = useState(originalDeviceA?.name.raw || "");
  const [queryB, setQueryB] = useState(originalDeviceB?.name.raw || "");
  const suggestionsA = useSignal<Device[]>([]);
  const suggestionsB = useSignal<Device[]>([]);

  const suggestionsARef = useRef<HTMLUListElement>(null);
  const suggestionsBRef = useRef<HTMLUListElement>(null);

  const selectedDeviceA = useSignal<Device | null>(originalDeviceA || null);
  const selectedDeviceB = useSignal<Device | null>(originalDeviceB || null);

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

  const queryAChanged = (value: string) => {
    setQueryA(value);
    suggestionsA.value = allDevices.filter((device) =>
      device.name.raw.toLowerCase().includes(value.trim().toLowerCase()) ||
      device.brand.toLowerCase().includes(value.trim().toLowerCase())
    );

    selectedDeviceA.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryA.toLowerCase()
      ) ?? null;
  };

  const setQueryASuggestion = (value: string) => {
    setQueryA(value);
    suggestionsA.value = [];

    selectedDeviceA.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryA.trim().toLowerCase()
      ) ?? null;

    if (selectedDeviceA.value && selectedDeviceB.value) {
      handleSubmit();
    }
  };

  const queryBChanged = (value: string) => {
    setQueryB(value);
    suggestionsB.value = allDevices.filter((device) =>
      device.name.raw.toLowerCase().includes(value.trim().toLowerCase()) ||
      device.brand.toLowerCase().includes(value.trim().toLowerCase())
    );

    selectedDeviceB.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryB.toLowerCase()
      ) ?? null;
  };

  const setQueryBSuggestion = (value: string) => {
    setQueryB(value);
    suggestionsB.value = [];
    selectedDeviceB.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryB.toLowerCase()
      ) ?? null;
    if (selectedDeviceA.value && selectedDeviceB.value) {
      handleSubmit();
    }
  };

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleSubmit = () => {
    if (selectedDeviceA.value && selectedDeviceB.value) {
      const sanitizedA = selectedDeviceA.value.name.sanitized;
      const sanitizedB = selectedDeviceB.value.name.sanitized;
      globalThis.location.href = `/compare?devices=${sanitizedA},${sanitizedB}`;
    } else {
      alert("Select valid devices for comparison.");
    }
  };

  const handleExampleComparison = (deviceA: string, deviceB: string) => {
    queryAChanged(deviceA);
    queryBChanged(deviceB);
  };

  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() === queryA.toLowerCase() ||
      deviceName.toLowerCase() === queryB.toLowerCase();
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              Compare
            </span>
            <input
              type="search"
              value={queryA}
              onInput={(e) => queryAChanged(e.currentTarget.value)}
              // onChange={(e) => queryAChanged(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
              {...(queryA === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryA),
              })}
            />
          </div>
          <div style={{ width: "100%" }}>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              Against
            </span>
            <input
              type="search"
              value={queryB}
              onInput={(e) => queryBChanged(e.currentTarget.value)}
              // onChange={(e) => queryBChanged(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
              {...(queryB === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryB),
              })}
            />
          </div>
        </div>
        <div id="suggestions-container">
          {suggestionsA.value.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsARef}>
              {suggestionsA.value.map((device) => (
                <li
                  key={device.name.sanitized}
                  onClick={() => setQueryASuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                  />
                </li>
              ))}
            </ul>
          )}
          {suggestionsB.value.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsBRef}>
              {suggestionsB.value.map((device) => (
                <li
                  key={device.name.sanitized}
                  onClick={() => setQueryBSuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {originalDeviceA && (
          <details>
            <summary>
              <strong>Similar Devices to {originalDeviceA.name.raw}</strong>
            </summary>
            <div class="similar-devices-compare-grid">
              {similarDevices.slice(0, 8).map((device) => (
                <div
                  key={device.name.sanitized}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                  }}
                  onClick={() => setQueryASuggestion(device.name.raw)}
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                  />
                </div>
              ))}
            </div>
          </details>
        )}

        {originalDeviceB && (
          <details>
            <summary>
              <strong>Similar Devices to {originalDeviceB?.name.raw}</strong>
            </summary>
            <div class="similar-devices-compare-grid">
              {similarDevices.slice(8, 16).map((device) => (
                <div
                  key={device.name.sanitized}
                  onClick={() => setQueryBSuggestion(device.name.raw)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: device.name.raw === queryB
                      ? "var(--color-primary)"
                      : "transparent",
                  }}
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                  />
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
      <div class="compare-form-examples">
        <button
          class="secondary"
          onClick={() => handleExampleComparison("Miyoo Flip", "RG-35XX SP")}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            Miyoo Flip <PiGitDiff /> RG-35XX SP
          </span>
        </button>
        <button
          class="secondary"
          onClick={() => handleExampleComparison("RG-405M", "RG-406H")}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            RG-405M <PiGitDiff /> RG-406H
          </span>
        </button>
        <button
          class="secondary"
          onClick={() => handleExampleComparison("Switch", "Odin 2 Portal")}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            Switch <PiGitDiff /> Odin 2 Portal
          </span>
        </button>
      </div>
    </form>
  );
}
