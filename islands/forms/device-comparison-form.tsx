import { PiGitDiff } from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { DeviceCardMedium } from "@components/cards/device-card-medium.tsx";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { searchDevices } from "@data/frontend/services/utils/search.utils.ts";

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

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const [queryA, setQueryA] = useState(originalDeviceA?.name.raw || "");
  const [queryB, setQueryB] = useState(originalDeviceB?.name.raw || "");
  const [suggestionsA, setSuggestionsA] = useState<Device[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<Device[]>([]);

  const suggestionsARef = useRef<HTMLUListElement>(null);
  const suggestionsBRef = useRef<HTMLUListElement>(null);

  const [selectedDeviceA, setSelectedDeviceA] = useState<Device | null>(
    originalDeviceA || null,
  );
  const [selectedDeviceB, setSelectedDeviceB] = useState<Device | null>(
    originalDeviceB || null,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsARef.current &&
        !suggestionsARef.current.contains(event.target as Node)
      ) {
        setSuggestionsA([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsBRef.current &&
        !suggestionsBRef.current.contains(event.target as Node)
      ) {
        setSuggestionsB([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const queryAChanged = (value: string) => {
    setQueryA(value);
    const suggestions = searchDevices(value.trim(), allDevices);
    setSuggestionsA(suggestions);

    const device =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryA.toLowerCase()
      ) ?? null;

    setSelectedDeviceA(device);
  };

  const queryBChanged = (value: string) => {
    setQueryB(value);
    const suggestions = searchDevices(value.trim(), allDevices);
    setSuggestionsB(suggestions);

    const device =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === queryB.toLowerCase()
      ) ?? null;

    setSelectedDeviceB(device);
  };

  const setQueryASuggestion = (value: string) => {
    queryAChanged(value);
    setSuggestionsA([]);

    const device = allDevices.find((device) =>
      device.name.raw.toLowerCase() === value.toLowerCase()
    );

    if (device) {
      globalThis.location.href =
        `/compare?devices=${device.name.sanitized},${selectedDeviceB?.name.sanitized}`;
    }
  };

  const setQueryBSuggestion = (value: string) => {
    queryBChanged(value);
    setSuggestionsB([]);

    const device = allDevices.find((device) =>
      device.name.raw.toLowerCase() === value.toLowerCase()
    );

    if (device) {
      globalThis.location.href =
        `/compare?devices=${selectedDeviceA?.name.sanitized},${device.name.sanitized}`;
    }
  };

  // useEffect(() => {
  //   if (
  //     selectedDeviceA &&
  //     selectedDeviceB &&
  //     (
  //       selectedDeviceA.name.sanitized !== originalDeviceA?.name.sanitized ||
  //       selectedDeviceB.name.sanitized !== originalDeviceB?.name.sanitized
  //     )
  //   ) {
  //     handleSubmit();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedDeviceA, selectedDeviceB]);

  const handleSubmit = () => {
    if (selectedDeviceA && selectedDeviceB) {
      const sanitizedA = selectedDeviceA.name.sanitized;
      const sanitizedB = selectedDeviceB.name.sanitized;
      globalThis.location.href = `/compare?devices=${sanitizedA},${sanitizedB}`;
    } else {
      alert("Select valid devices for comparison.");
    }
  };

  const handleExampleComparison = (
    deviceA: string,
    deviceB: string,
    index: number,
  ) => {
    if (index === 1) {
      setIsLoading1(true);
    } else if (index === 2) {
      setIsLoading2(true);
    } else if (index === 3) {
      setIsLoading3(true);
    }
    globalThis.location.href = `/compare?devices=${deviceA},${deviceB}`;
  };

  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() === queryA.toLowerCase() ||
      deviceName.toLowerCase() === queryB.toLowerCase();
  };

  return (
    <div>
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
              placeholder="Start typing for suggestions..."
              aria-label="Search devices"
              {...(queryA === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryA),
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
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
              With
            </span>
            <input
              type="search"
              value={queryB}
              onInput={(e) => queryBChanged(e.currentTarget.value)}
              placeholder="Start typing for suggestions..."
              aria-label="Search devices"
              {...(queryB === "" ? {} : {
                ariaInvalid: deviceNameIsInvalid(queryB),
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        {/* Suggestions */}
        <div id="suggestions-container">
          {suggestionsA.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsARef}>
              {suggestionsA.map((device) => (
                <li
                  key={device.name.sanitized}
                  onClick={() => setQueryASuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                    showLikeButton={false}
                  />
                </li>
              ))}
            </ul>
          )}
          {suggestionsB.length > 0 && (
            <ul class="suggestions-list" ref={suggestionsBRef}>
              {suggestionsB.map((device) => (
                <li
                  key={device.name.sanitized}
                  onClick={() => setQueryBSuggestion(device.name.raw)}
                  class="suggestions-list-item"
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                    showLikeButton={false}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Similar Devices */}
        {originalDeviceA && (
          <details>
            <summary class="flex">
              <div style={{ display: "flex", alignItems: "center" }}>
                <PiGitDiff />
                &nbsp;Similar Devices to {originalDeviceA.name.raw}
              </div>
            </summary>
            <div class="similar-devices-compare-grid">
              {similarDevices.slice(0, 8).map((device) => (
                <div
                  key={device.name.sanitized}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                  }}
                  onClick={() => setQueryASuggestion(device.name.sanitized)}
                >
                  <DeviceCardMedium
                    device={device}
                    isActive={isActive(device.name.raw)}
                    showLikeButton={false}
                  />
                </div>
              ))}
            </div>
          </details>
        )}

        {originalDeviceB && (
          <details>
            <summary class="flex">
              <div style={{ display: "flex", alignItems: "center" }}>
                <PiGitDiff />
                &nbsp;Similar Devices to {originalDeviceB?.name.raw}
              </div>
            </summary>
            <div class="similar-devices-compare-grid">
              {similarDevices.slice(8, 16).map((device) => (
                <div
                  key={device.name.sanitized}
                  onClick={() => setQueryBSuggestion(device.name.sanitized)}
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
                    showLikeButton={false}
                  />
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Examples */}
      <div class="compare-form-examples">
        <button
          class="secondary"
          onClick={() => handleExampleComparison("miyoo-flip", "rg-35xx-sp", 1)}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-busy={isLoading1}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            Miyoo Flip <PiGitDiff /> RG-35XX SP
          </span>
        </button>
        <button
          class="secondary"
          onClick={() =>
            handleExampleComparison("retroid-pocket-5", "rg-406h", 2)}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-busy={isLoading2}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            Retroid Pocket 5 <PiGitDiff /> RG-406H
          </span>
        </button>
        <button
          class="secondary"
          onClick={() =>
            handleExampleComparison("ayaneo-pocket-evo", "odin-2-portal", 3)}
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-busy={isLoading3}
        >
          <span style={{ display: "flex", gap: "0.25rem" }}>
            AYANEO Pocket Evo <PiGitDiff /> Odin 2 Portal
          </span>
        </button>
      </div>
    </div>
  );
}
