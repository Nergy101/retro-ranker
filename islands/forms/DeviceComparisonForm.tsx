import { PiQuestion, PiTrash } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
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
    !allDeviceRawNames.some((name) => name === deviceName);

  const queryA = useSignal(originalDeviceA?.name.raw || "");
  const queryB = useSignal(originalDeviceB?.name.raw || "");
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

    if (queryA.value && queryB.value) {
      handleSubmit();
    }
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

    if (queryA.value && queryB.value) {
      handleSubmit();
    }
  };

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();
    handleSubmit();
  };

  const handleSubmit = () => {
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

  const handleExampleComparison = (deviceA: string, deviceB: string) => {
    setQueryA(deviceA);
    setQueryB(deviceB);
  };

  const isActive = (deviceName: string) => {
    return deviceName === queryA.value || deviceName === queryB.value;
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
              value={queryA.value}
              onInput={(e) => setQueryA(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
              {...(queryA.value === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryA.value),
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
              value={queryB.value}
              onInput={(e) => setQueryB(e.currentTarget.value)}
              placeholder="Search for a device..."
              aria-label="Search devices"
              {...(queryB.value === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryB.value),
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
                    backgroundColor: device.name.raw === queryB.value
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
            Miyoo Flip vs RG-35XX SP
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
            Switch vs Odin 2 Portal
          </span>
        </button>
        <button
          class="secondary"
          onClick={() => handleExampleComparison("RG-34XX", "GKD Pixel 2")}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            RG-34XX vs GKD Pixel 2
          </span>
        </button>
      </div>
    </form>
  );
}
