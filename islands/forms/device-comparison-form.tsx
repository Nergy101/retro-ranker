import { PiGitDiff } from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";

// Simple search function for devices
const searchDevices = (query: string, devices: Device[]): Device[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return devices.filter((device) =>
    device.name.raw.toLowerCase().includes(lowerQuery) ||
    device.brand.raw.toLowerCase().includes(lowerQuery) ||
    device.name.sanitized.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

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
  const allDeviceSanitizedNames = allDevices.map((device) =>
    device.name.sanitized
  );

  const deviceNameIsInvalid = (deviceName: string) =>
    !allDeviceRawNames.some((name) =>
      name.toLowerCase() === deviceName.toLowerCase() ||
      allDeviceSanitizedNames.some((name) =>
        name.toLowerCase() === deviceName.toLowerCase()
      )
    );

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);
  const [isLoading5, setIsLoading5] = useState(false);
  const [isLoading6, setIsLoading6] = useState(false);

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
        device.name.raw.toLowerCase() === value.toLowerCase() ||
        device.name.sanitized.toLowerCase() === value.toLowerCase()
      ) ?? null;

    setSelectedDeviceA(device);
  };

  const queryBChanged = (value: string) => {
    setQueryB(value);
    const suggestions = searchDevices(value.trim(), allDevices);
    setSuggestionsB(suggestions);

    const device =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase() ||
        device.name.sanitized.toLowerCase() === value.toLowerCase()
      ) ?? null;

    setSelectedDeviceB(device);
  };

  const setQueryASuggestion = (value: string) => {
    queryAChanged(value);
    setSuggestionsA([]);

    const device = allDevices.find((device) =>
      device.name.raw.toLowerCase() === value.toLowerCase() ||
      device.name.sanitized.toLowerCase() === value.toLowerCase()
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
      device.name.raw.toLowerCase() === value.toLowerCase() ||
      device.name.sanitized.toLowerCase() === value.toLowerCase()
    );

    if (device) {
      globalThis.location.href =
        `/compare?devices=${selectedDeviceA?.name.sanitized},${device.name.sanitized}`;
    }
  };

  const handleSubmit = () => {
    if (selectedDeviceA && selectedDeviceB) {
      const sanitizedA = selectedDeviceA.name.sanitized;
      const sanitizedB = selectedDeviceB.name.sanitized;
      globalThis.location.href = `/compare?devices=${sanitizedA},${sanitizedB}`;
    } else {
      alert("Please select valid devices");
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
    } else if (index === 4) {
      setIsLoading4(true);
    } else if (index === 5) {
      setIsLoading5(true);
    } else if (index === 6) {
      setIsLoading6(true);
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
              placeholder="Start typing..."
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
              with
            </span>
            <input
              type="search"
              value={queryB}
              onInput={(e) => queryBChanged(e.currentTarget.value)}
              placeholder="Start typing..."
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
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Similar Devices */}
        {(originalDeviceA && originalDeviceB) && (
          <details>
            <summary class="flex">
              <div style={{ display: "flex", alignItems: "center" }}>
                <PiGitDiff />
                &nbsp;Compare {originalDeviceA?.name.raw} against...
              </div>
            </summary>
            <div class="similar-devices-compare-grid">
              {(() => {
                return similarDevices.slice(8, 16).map((device) => {
                  return (
                    <div
                      key={device.name.sanitized}
                      style={{
                        cursor: "pointer",
                        borderRadius: "0.5rem",
                      }}
                      onClick={() => setQueryBSuggestion(device.name.sanitized)}
                    >
                      <DeviceCardMedium
                        device={device}
                        isActive={isActive(device.name.raw)}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </details>
        )}
        {(originalDeviceA && originalDeviceB) && (
          <details>
            <summary class="flex">
              <div style={{ display: "flex", alignItems: "center" }}>
                <PiGitDiff />
                &nbsp;Compare {originalDeviceB.name.raw} against...
              </div>
            </summary>
            <div class="similar-devices-compare-grid">
              {(() => {
                return similarDevices.slice(0, 8).map((device) => {
                  return (
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
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </details>
        )}
      </div>

      {/* Quick comparisons */}
      <div class="compare-form-examples">
        {(() => {
          /* Compute quick comparisons from allDevices */
          const handhelds = allDevices.filter((d) =>
            d.deviceType === "handheld"
          );
          const nonUpcomingHandhelds = handhelds.filter((d) =>
            !(d.released.raw?.toLowerCase().includes("upcoming"))
          );
          const midPriced = nonUpcomingHandhelds.filter((d) =>
            d.pricing?.category === "mid"
          );
          const sortedByScore = [...midPriced].sort((a, b) =>
            (b.totalRating ?? 0) - (a.totalRating ?? 0)
          );

          // Top two vertical (match substrings; exclude clamshell variants)
          const verticalCandidates = sortedByScore
            .filter((d) => {
              const ff = d.formFactor?.toLowerCase() ?? "";
              return ff.includes("vertical") && !ff.includes("clamshell");
            });

          // Top two horizontal (match substrings; exclude clamshell variants)
          const horizontalCandidates = sortedByScore
            .filter((d) => {
              const ff = d.formFactor?.toLowerCase() ?? "";
              return ff.includes("horizontal") && !ff.includes("clamshell");
            });

          // Top two clamshells
          const clamshellCandidates = sortedByScore
            .filter((d) => {
              const ff = d.formFactor?.toLowerCase() ?? "";
              return ff.includes("clamshell");
            });

          const pickTopTwoDifferentBrands = (list: Device[]): Device[] => {
            for (let i = 0; i < list.length; i++) {
              for (let j = i + 1; j < list.length; j++) {
                const a = list[i];
                const b = list[j];
                const brandA = a.brand?.normalized?.toLowerCase() ??
                  a.brand?.raw?.toLowerCase() ?? "";
                const brandB = b.brand?.normalized?.toLowerCase() ??
                  b.brand?.raw?.toLowerCase() ?? "";
                if (brandA && brandB && brandA !== brandB) {
                  return [a, b];
                }
              }
            }
            return list.slice(0, 2);
          };

          const horizontalTop2 = pickTopTwoDifferentBrands(
            horizontalCandidates,
          );
          const verticalTop2 = pickTopTwoDifferentBrands(verticalCandidates);
          const clamshellTop2 = pickTopTwoDifferentBrands(clamshellCandidates);
          const overallTop2 = pickTopTwoDifferentBrands(sortedByScore);

          // Build unique set of pairs (avoid duplicates across dynamic and user-defined)
          const makePairKey = (a: Device, b: Device) => {
            const ids = [a.name.sanitized, b.name.sanitized].sort();
            return ids.join("|");
          };
          const seenPairs = new Set<string>();
          const dynamicPairs: { a: Device; b: Device; index: number }[] = [];
          const tryAddDynamic = (pair: Device[] | null, index: number) => {
            if (!pair || pair.length !== 2) return;
            const key = makePairKey(pair[0], pair[1]);
            if (seenPairs.has(key)) return;
            seenPairs.add(key);
            dynamicPairs.push({ a: pair[0], b: pair[1], index });
          };

          // Order: 1=Horizontal, 2=Vertical, 3=Clamshell, 4=Overall
          tryAddDynamic(horizontalTop2.length === 2 ? horizontalTop2 : null, 1);
          tryAddDynamic(verticalTop2.length === 2 ? verticalTop2 : null, 2);
          tryAddDynamic(clamshellTop2.length === 2 ? clamshellTop2 : null, 3);
          tryAddDynamic(overallTop2.length === 2 ? overallTop2 : null, 4);

          // User-defined comparisons (editable by name)
          const userDefinedComparisons: { deviceA: string; deviceB: string }[] =
            [
              { deviceA: "Miyoo Flip", deviceB: "RG-35XX SP" },
              { deviceA: "RG-477M", deviceB: "RG-476H" },
              { deviceA: "thor", deviceB: "pocket-ds" },
            ];

          const resolveByName = (name: string): Device | undefined => {
            const lower = name.toLowerCase();
            return allDevices.find((d) => d.name.raw.toLowerCase() === lower) ||
              allDevices.find((d) => d.name.sanitized.toLowerCase() === lower);
          };

          // Compose final list: dynamic first, then user-defined until 6 total, skipping duplicates
          const buttons: { a: Device; b: Device; index: number }[] = [
            ...dynamicPairs,
          ];
          for (
            let i = 0;
            i < userDefinedComparisons.length && buttons.length < 6;
            i++
          ) {
            const pair = userDefinedComparisons[i];
            const a = resolveByName(pair.deviceA);
            const b = resolveByName(pair.deviceB);
            if (!a || !b) continue;
            const key = makePairKey(a, b);
            if (seenPairs.has(key)) continue;
            seenPairs.add(key);
            // manual buttons start from index 5
            buttons.push({
              a,
              b,
              index: 4 + buttons.filter((p) => p.index <= 4).length +
                (buttons.filter((p) => p.index > 4).length + 1),
            });
          }

          return (
            <>
              {buttons.map(({ a, b, index }) => {
                const isBusy = index === 1
                  ? isLoading1
                  : index === 2
                  ? isLoading2
                  : index === 3
                  ? isLoading3
                  : index === 4
                  ? isLoading4
                  : index === 5
                  ? isLoading5
                  : isLoading6;
                return (
                  <button
                    key={`${a.name.sanitized}-${b.name.sanitized}-${index}`}
                    class="secondary"
                    onClick={() =>
                      handleExampleComparison(
                        a.name.sanitized,
                        b.name.sanitized,
                        index,
                      )}
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                    aria-busy={isBusy}
                  >
                    <span style={{ display: "flex", gap: "0.25rem" }}>
                      {a.name.raw} <PiGitDiff /> {b.name.raw}
                    </span>
                  </button>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
}
