import { PiFloppyDisk } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";

export default function CollectionCreateForm(
  { devices }: { devices: Device[] },
) {
  const isSubmitting = useSignal(false);

  const selectedDevices = useSignal<Device[]>([]);
  const name = useSignal<string>("");
  const description = useSignal<string>("");

  const selectedDevice = useSignal<Device | null>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const suggestions = useSignal<Device[]>([]);
  const query = useSignal<string>("");

  const collectionType = useSignal<"Normal" | "Ranked">("Normal");
  const deviceOrder = useSignal<{ [deviceId: string]: number }>({});

  // FLIP animation refs
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const prevPositions = useRef<{ [id: string]: DOMRect }>({});

  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() ===
      selectedDevice.value?.name.raw.toLowerCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        suggestions.value = [];
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const queryChanged = (value: string) => {
    query.value = value;
    suggestions.value = searchDevices(value.trim(), devices);

    selectedDevice.value =
      devices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase()
      ) ?? null;
  };

  const setQuerySuggestion = (value: string) => {
    queryChanged(value);
    suggestions.value = [];
  };

  const handleDeviceSelect = (device: Device) => {
    selectedDevices.value = [...selectedDevices.value, device];
    if (collectionType.value === "Ranked") {
      deviceOrder.value = {
        ...deviceOrder.value,
        [device.id]: Object.keys(deviceOrder.value).length + 1,
      };
    }
  };

  const handleDeviceRemove = (deviceId: string) => {
    selectedDevices.value = selectedDevices.value.filter((device) =>
      device.id !== deviceId
    );
    if (collectionType.value === "Ranked") {
      const { [deviceId]: _, ...rest } = deviceOrder.value;
      deviceOrder.value = rest;
    }
  };

  const handleOrderChange = (deviceId: string, value: string) => {
    const newOrder = parseInt(value, 10);
    if (!isNaN(newOrder) && newOrder >= 1) {
      // Remove the device from its current position
      const currentDevices = selectedDevices.value.filter((d) =>
        d.id !== deviceId
      );
      // Clamp the new position to the array bounds
      const insertAt = Math.min(newOrder - 1, currentDevices.length);
      // Find the device object
      const movedDevice = selectedDevices.value.find((d) => d.id === deviceId);
      if (!movedDevice) return;
      // Insert the device at the new position
      currentDevices.splice(insertAt, 0, movedDevice);
      // Reassign order numbers
      const updatedDeviceOrder: { [deviceId: string]: number } = {};
      currentDevices.forEach((device, idx) => {
        updatedDeviceOrder[device.id] = idx + 1;
      });
      // Update the signals
      selectedDevices.value = currentDevices;
      deviceOrder.value = updatedDeviceOrder;
    }
  };

  const isDisabled = () => {
    return isSubmitting.value || name.value === "" || name.value.length <= 3;
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("type", collectionType.value);
    if (description.value) {
      formData.append("description", description.value);
    }
    if (selectedDevices.value.length > 0) {
      const deviceIds = selectedDevices.value.map((device) => device.id);
      formData.append("deviceIds", deviceIds.join(","));
      if (collectionType.value === "Ranked") {
        const orderArr = selectedDevices.value.map((device) => ({
          [device.id]: deviceOrder.value[device.id] || 1,
        }));
        formData.append("order", JSON.stringify(orderArr));
      }
    }
    try {
      await fetch("/api/collections", {
        method: "POST",
        body: formData,
      });
      globalThis.location.href = "/profile";
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Error submitting form:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const setName = (value: string) => {
    name.value = value;
  };

  // Animate card movement on order change
  useEffect(() => {
    const newPositions: { [id: string]: DOMRect } = {};
    selectedDevices.value.forEach((device) => {
      const node = cardRefs.current[device.id];
      if (node) {
        newPositions[device.id] = node.getBoundingClientRect();
      }
    });

    // Animate from previous to new positions
    Object.keys(newPositions).forEach((id) => {
      const node = cardRefs.current[id];
      const prev = prevPositions.current[id];
      const next = newPositions[id];
      if (node && prev) {
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (dx !== 0 || dy !== 0) {
          node.style.transition = "none";
          node.style.transform = `translate(${dx}px, ${dy}px)`;
          // Force reflow
          node.getBoundingClientRect();
          node.style.transition =
            "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)";
          node.style.transform = "";
        }
      }
    });

    // Save new positions for next time
    prevPositions.current = newPositions;
  }, [selectedDevices.value.map((d) => d.id).join(",")]);

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <label>
          <input
            type="radio"
            name="collectionType"
            value="Normal"
            checked={collectionType.value === "Normal"}
            onChange={() => collectionType.value = "Normal"}
          />
          Normal
        </label>
        <label>
          <input
            type="radio"
            name="collectionType"
            value="Ranked"
            checked={collectionType.value === "Ranked"}
            onChange={() => collectionType.value = "Ranked"}
          />
          Ranked
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Collection Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name.value}
            onChange={(e) => setName(e.currentTarget.value)}
            onKeyDown={(e) => {
              setName(e.currentTarget.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description.value}
            onChange={(e) => description.value = e.currentTarget.value}
          />
        </div>

        {/* Hidden input for device IDs */}
        {selectedDevices.value.map((device) => (
          <input
            key={device.id}
            type="hidden"
            value={device.id}
          />
        ))}

        <div>
          <input
            type="search"
            placeholder="Start searching for devices..."
            name="search"
            aria-label="Search"
            onInput={(e) => queryChanged(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const exactDevice = devices.find((device) =>
                  device.name.raw.toLowerCase() ===
                    e.currentTarget.value.toLowerCase()
                ) ?? null;
                if (exactDevice) {
                  handleDeviceSelect(exactDevice);
                }
              }
            }}
          />

          <div id="suggestions-container">
            {suggestions.value.length > 0 && (
              <ul class="suggestions-list" ref={suggestionsRef}>
                {suggestions.value.map((device) => (
                  <li
                    key={device.name.sanitized}
                    onClick={() => setQuerySuggestion(device.name.raw)}
                    class="suggestions-list-item"
                  >
                    <div
                      onClick={() =>
                        handleDeviceSelect(device)}
                      style={{
                        cursor: "pointer",
                        flex: 1,
                      }}
                    >
                      <DeviceCardMedium
                        device={device}
                        isActive={isActive(device.name.raw)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedDevices.value.length === 0 && (
          <div>
            <p>No devices selected</p>
            <p>
              Start searching for devices above to add them to your collection.
            </p>
          </div>
        )}

        {selectedDevices.value.length > 0 && (
          <div style={{ padding: "2rem" }}>
            <h2>Selected Devices</h2>
            <div class="collection-devices-grid">
              {selectedDevices.value.map((device) => {
                return (
                  <div
                    class="collection-device-card"
                    key={device.id}
                    ref={(el) => {
                      cardRefs.current[device.id] = el;
                    }}
                    style={{
                      marginBottom: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <DeviceCardMedium
                      device={device}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {collectionType.value === "Ranked" && (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span>#</span>
                          <input
                            type="number"
                            min={1}
                            value={deviceOrder.value[device.id] || 1}
                            onClick={(e) => e.stopPropagation()}
                            onInput={(e) => {
                              // Just update the order value for this device, don't reorder yet
                              const val =
                                (e.currentTarget as HTMLInputElement).value;
                              const order = parseInt(val, 10);
                              if (!isNaN(order)) {
                                deviceOrder.value = {
                                  ...deviceOrder.value,
                                  [device.id]: order,
                                };
                              }
                            }}
                            onBlur={(e) => {
                              handleOrderChange(
                                device.id,
                                (e.currentTarget as HTMLInputElement).value,
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleOrderChange(
                                  device.id,
                                  (e.currentTarget as HTMLInputElement).value,
                                );
                              }
                            }}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeviceRemove(device.id)}
                        style={{
                          marginTop: "0.75rem",
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "0.3rem",
                          padding: "0.4rem 1rem",
                          cursor: "pointer",
                          fontSize: "0.95em",
                          fontWeight: 500,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                          transition: "background 0.2s",
                        }}
                        data-tooltip="Remove device"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
          disabled={isDisabled()}
        >
          <PiFloppyDisk />
          {isSubmitting.value ? "Saving..." : "Save Collection"}
        </button>
      </form>
    </>
  );
}
