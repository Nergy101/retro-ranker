import { PiFloppyDisk, PiTrash } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceCardRow } from "../../components/cards/DeviceCardRow.tsx";
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
  };

  const handleDeviceRemove = (deviceId: string) => {
    selectedDevices.value = selectedDevices.value.filter((device) =>
      device.id !== deviceId
    );
  };

  const isDisabled = () => {
    return isSubmitting.value || name.value === "" || name.value.length <= 3;
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append("name", name.value);

    if (description.value) {
      formData.append("description", description.value);
    }

    if (selectedDevices.value.length > 0) {
      const deviceIds = selectedDevices.value.map((device) => device.id);
      formData.append("deviceIds", deviceIds.join(","));
    }
    try {
      await fetch("/api/collections", {
        method: "POST",
        body: formData,
      });
      globalThis.location.href = "/profile";
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const setName = (value: string) => {
    name.value = value;
  };

  return (
    <>
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
              {selectedDevices.value.map((device) => (
                <div
                  onClick={() => handleDeviceRemove(device.id)}
                  data-tooltip="Remove device"
                >
                  <DeviceCardMedium
                    device={device}
                  />
                </div>
              ))}
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
