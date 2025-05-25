import { PiFloppyDisk, PiTrash } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceCollection } from "../../data/frontend/contracts/device-collection.ts";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { searchDevices } from "../../data/frontend/services/utils/search.utils.ts";
import { createLoggedInPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";

export default function CollectionUpdateForm(
  { allDevices, existingCollectionDevices, collection }: {
    allDevices: Device[];
    existingCollectionDevices: Device[];
    collection: DeviceCollection;
  },
) {
  const isSubmitting = useSignal(false);

  const collectionType = useSignal<"Normal" | "Ranked">(
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
  const deviceOrder = useSignal<{ [deviceId: string]: number }>(initialOrder);

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

  const selectedDevices = useSignal<Device[]>(sortedDevices);
  const name = useSignal<string>(collection.name);
  const description = useSignal<string>(collection.description);

  const selectedDevice = useSignal<Device | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const suggestions = useSignal<Device[]>([]);
  const query = useSignal<string>("");

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
    suggestions.value = searchDevices(value.trim(), allDevices);

    selectedDevice.value =
      allDevices.find((device) =>
        device.name.raw.toLowerCase() === value.toLowerCase()
      ) ?? null;
  };

  const setQuerySuggestion = (value: string) => {
    query.value = value;
    suggestions.value = [];
  };

  const handleDeviceSelect = (device: Device) => {
    if (!selectedDevices.value.find((d) => d.id === device.id)) {
      selectedDevices.value = [...selectedDevices.value, device];
      if (collectionType.value === "Ranked") {
        deviceOrder.value = {
          ...deviceOrder.value,
          [device.id]: Object.keys(deviceOrder.value).length + 1,
        };
      }
    }
    query.value = "";
    suggestions.value = [];
  };

  const handleDeviceRemove = (deviceId: string) => {
    selectedDevices.value = selectedDevices.value.filter(
      (device) => device.id !== deviceId,
    );
    if (collectionType.value === "Ranked") {
      const { [deviceId]: _, ...rest } = deviceOrder.value;
      deviceOrder.value = rest;
    }
  };

  const handleOrderChange = (deviceId: string, value: string) => {
    const newOrder = parseInt(value, 10);
    if (!isNaN(newOrder) && newOrder >= 1) {
      const currentDevices = selectedDevices.value.filter((d) =>
        d.id !== deviceId
      );
      const insertAt = Math.min(newOrder - 1, currentDevices.length);
      const movedDevice = selectedDevices.value.find((d) => d.id === deviceId);
      if (!movedDevice) return;
      currentDevices.splice(insertAt, 0, movedDevice);
      const updatedDeviceOrder: { [deviceId: string]: number } = {};
      currentDevices.forEach((device, idx) => {
        updatedDeviceOrder[device.id] = idx + 1;
      });
      selectedDevices.value = currentDevices;
      deviceOrder.value = updatedDeviceOrder;
    }
  };

  const isDisabled = () => {
    return name.value.trim() === "" || selectedDevices.value.length === 0;
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (isDisabled()) return;

    isSubmitting.value = true;

    try {
      const pocketbaseClient = await createLoggedInPocketBaseService(
        document.cookie,
      );

      let orderArr: Array<Record<string, number>> = [];
      if (collectionType.value === "Ranked") {
        orderArr = selectedDevices.value.map((device) => ({
          [device.id]: deviceOrder.value[device.id] || 1,
        }));
      }

      await pocketbaseClient.update("device_collections", collection.id, {
        name: name.value.trim(),
        description: description.value.trim(),
        devices: selectedDevices.value.map((device) => device.id),
        type: collectionType.value,
        order: orderArr,
      });

      globalThis.location.href = "/profile";
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Failed to update collection:", error);
      alert("Failed to update collection. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  };

  const setName = (value: string) => {
    name.value = value;
  };

  const setDescription = (value: string) => {
    description.value = value;
  };

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
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name.value}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description.value}
            onInput={(e) =>
              setDescription((e.target as HTMLTextAreaElement).value)}
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            for="device-search"
            class="block text-sm font-medium text-gray-700"
          >
            Add Devices
          </label>
          <div class="relative mt-1">
            <input
              type="text"
              id="device-search"
              value={query.value}
              onInput={(e) =>
                queryChanged((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedDevice.value) {
                    handleDeviceSelect(selectedDevice.value);
                  }
                }
              }}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search devices..."
            />
            {suggestions.value.length > 0 && (
              <div>
                <div
                  ref={suggestionsRef}
                  class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {suggestions.value.map((device) => (
                    <div
                      key={device.id}
                      onClick={() => {
                        setQuerySuggestion(device.name.raw);
                        handleDeviceSelect(device);
                      }}
                    >
                      <div class="px-3 py-2">
                        <DeviceCardMedium
                          device={device}
                          isActive={isActive(device.name.raw)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <hr
                  style={{ border: "1px solid var(--pico-muted-border-color)" }}
                />
              </div>
            )}
          </div>
        </div>

        <div class="edit-collection-devices-grid">
          {selectedDevices.value.map((device) => (
            <div key={device.id} class="relative h-full">
              <div>
                <DeviceCardMedium device={device} />
              </div>
              {collectionType.value === "Ranked" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <span>#</span>
                  <input
                    type="number"
                    min={1}
                    value={deviceOrder.value[device.id] || 1}
                    onClick={(e) => e.stopPropagation()}
                    onInput={(e) => {
                      const val = (e.currentTarget as HTMLInputElement).value;
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
                style={{
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                type="button"
                onClick={() =>
                  handleDeviceRemove(device.id)}
              >
                <PiTrash />
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            type="submit"
            disabled={isDisabled() || isSubmitting.value}
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting.value
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
