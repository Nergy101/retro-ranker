import { PiFloppyDisk, PiTrash } from "@preact-icons/pi";
import { useEffect, useRef, useState } from "preact/hooks";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";
// import { createLoggedInPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";

export function CollectionUpdateForm(
  { allDevices, existingCollectionDevices, collection }: {
    allDevices: Device[];
    existingCollectionDevices: Device[];
    collection: DeviceCollection;
  },
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [collectionType, setCollectionType] = useState<"Normal" | "Ranked">(
    collection.type || "Normal",
  );
  const initialOrder: { [deviceId: string]: number } = {};
  if (collection.order && Array.isArray(collection.order)) {
    collection.order.forEach((orderObj) => {
      const [deviceId, order] = Object.entries(orderObj)[0];
      initialOrder[deviceId] = order;
    });
  } else {
    existingCollectionDevices.forEach((device, idx) => {
      initialOrder[device.id] = idx + 1;
    });
  }
  const [deviceOrder, setDeviceOrder] = useState<
    { [deviceId: string]: number }
  >(initialOrder);

  const sortedDevices = (() => {
    if (
      (collection.type || "Normal") === "Ranked" && collection.order &&
      Array.isArray(collection.order)
    ) {
      const deviceMap: { [id: string]: Device } = {};
      allDevices.forEach((device) => {
        deviceMap[device.id] = device;
      });
      return collection.order
        .map((orderObj) => {
          const deviceId = Object.keys(orderObj)[0];
          return deviceMap[deviceId];
        })
        .filter(Boolean);
    } else {
      return allDevices.filter((device) =>
        existingCollectionDevices.some((d: Device) => d.id === device.id)
      );
    }
  })();

  const [selectedDevices, setSelectedDevices] = useState<Device[]>(
    sortedDevices,
  );
  const [name, setName] = useState<string>(collection.name);
  const [description, setDescription] = useState<string>(
    collection.description,
  );

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const [suggestions, setSuggestions] = useState<Device[]>([]);
  const [query, setQuery] = useState<string>("");

  const isActive = (deviceName: string) => {
    return deviceName.toLowerCase() ===
      selectedDevice?.name.raw.toLowerCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const queryChanged = (value: string) => {
    setQuery(value);
    setSuggestions(searchDevices(value.trim(), allDevices));

    setSelectedDevice(
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase()
      ) ?? null,
    );
  };

  const setQuerySuggestion = (value: string) => {
    setQuery(value);
    setSuggestions([]);
  };

  const handleDeviceSelect = (device: Device) => {
    if (!selectedDevices.find((d) => d.id === device.id)) {
      setSelectedDevices([...selectedDevices, device]);
      if (collectionType === "Ranked") {
        setDeviceOrder({
          ...deviceOrder,
          [device.id]: Object.keys(deviceOrder).length + 1,
        });
      }
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleDeviceRemove = (deviceId: string) => {
    setSelectedDevices(selectedDevices.filter(
      (device) => device.id !== deviceId,
    ));
    if (collectionType === "Ranked") {
      const { [deviceId]: _, ...rest } = deviceOrder;
      setDeviceOrder(rest);
    }
  };

  const handleOrderChange = (deviceId: string, value: string) => {
    const newOrder = parseInt(value, 10);
    if (!isNaN(newOrder) && newOrder >= 1) {
      const currentDevices = selectedDevices.filter((d) => d.id !== deviceId);
      const insertAt = Math.min(newOrder - 1, currentDevices.length);
      const movedDevice = selectedDevices.find((d) => d.id === deviceId);
      if (!movedDevice) return;
      currentDevices.splice(insertAt, 0, movedDevice);
      const updatedDeviceOrder: { [deviceId: string]: number } = {};
      currentDevices.forEach((device, idx) => {
        updatedDeviceOrder[device.id] = idx + 1;
      });
      setSelectedDevices(currentDevices);
      setDeviceOrder(updatedDeviceOrder);
    }
  };

  const isDisabled = () => {
    return name.trim() === "" || selectedDevices.length === 0;
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isDisabled()) return;

    setIsSubmitting(true);

    try {
      let orderArr: Array<Record<string, number>> = [];
      if (collectionType === "Ranked") {
        orderArr = selectedDevices.map((device) => ({
          [device.id]: deviceOrder[device.id] || 1,
        }));
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append(
        "devices",
        selectedDevices.map((device) => device.id).join(","),
      );
      formData.append("type", collectionType);
      if (collectionType === "Ranked") {
        formData.append("order", JSON.stringify(orderArr));
      }

      const response = await fetch(`/api/collections/${collection.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      globalThis.location.href = "/profile";
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Failed to update collection:", error);
      alert("Failed to update collection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustName = (value: string) => {
    setName(value);
  };

  const adjustDescription = (value: string) => {
    setDescription(value);
  };

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <label>
          <input
            type="radio"
            name="collectionType"
            value="Normal"
            checked={collectionType === "Normal"}
            onChange={() => setCollectionType("Normal")}
          />
          Normal
        </label>
        <label>
          <input
            type="radio"
            name="collectionType"
            value="Ranked"
            checked={collectionType === "Ranked"}
            onChange={() => setCollectionType("Ranked")}
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
            value={name}
            onChange={(e) => adjustName(e.currentTarget.value)}
            onKeyDown={(e) => {
              adjustName(e.currentTarget.value);
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
            value={description}
            onChange={(e) => adjustDescription(e.currentTarget.value)}
          />
        </div>

        <div>
          <input
            type="search"
            placeholder="Start searching for devices..."
            name="search"
            aria-label="Search"
            value={query}
            onInput={(e) => queryChanged(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const exactDevice = allDevices.find((device) =>
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
            {suggestions.length > 0 && (
              <ul class="suggestions-list" ref={suggestionsRef}>
                {suggestions.map((device) => (
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

        {selectedDevices.length > 0 && (
          <div style={{ padding: "2rem" }}>
            <h2>Selected Devices</h2>
            <div class="collection-devices-grid">
              {selectedDevices.map((device) => {
                return (
                  <div
                    class="collection-device-card"
                    key={device.id}
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
                      {collectionType === "Ranked" && (
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
                            value={deviceOrder[device.id] || 1}
                            onClick={(e) => e.stopPropagation()}
                            onInput={(e) => {
                              const val =
                                (e.currentTarget as HTMLInputElement).value;
                              const order = parseInt(val, 10);
                              if (!isNaN(order)) {
                                setDeviceOrder({
                                  ...deviceOrder,
                                  [device.id]: order,
                                });
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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            type="submit"
            disabled={isDisabled() || isSubmitting}
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? (
                "Updating..."
              )
              : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <PiFloppyDisk class="mr-2 h-4 w-4" />
                  Update Collection
                </div>
              )}
          </button>
        </div>
      </form>
    </>
  );
}
