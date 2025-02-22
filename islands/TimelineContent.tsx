import { useEffect } from "preact/hooks";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { Device } from "../data/device.model.ts";

interface TimelineContentProps {
  upcomingDevices: Device[];
  devicesGroupedByYearAndMonth: Record<string, Device[]>;
}

export function TimelineContent(
  { upcomingDevices, devicesGroupedByYearAndMonth }: TimelineContentProps,
) {
  useEffect(() => {
    const hash = globalThis.location?.hash?.slice(1);
    // Get the hash from the URL (without the #)
    if (hash) {
      // Find the element with the matching ID
      const element = document.getElementById(hash);
      if (element) {
        // Scroll the element into view with a smooth animation
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const getKeyName = (key: string) => {
    const date = new Date(key);
    const month = date.toLocaleString("default", { month: "long" });
    return (
      <div>
        <span>{month}</span>
        <br />
        <span>{date.getFullYear()}</span>
      </div>
    );
  };

  return (
    <div class="timeline">
      <div class="timeline-container">
        <div class="timeline-dot-top"></div>
        <div
          class="timeline-text"
          onClick={() => {
            globalThis.location.hash = "upcoming";
            globalThis.navigator.clipboard.writeText(
              `${globalThis.location.origin}/release-timeline#upcoming`,
            );
          }}
          data-tooltip="Click to copy link to this section"
        >
          <span>Upcoming</span>
          <br />
          <span>Devices</span>
        </div>
        <div class="timeline-body">
          <div class="timeline-devices-grid">
            {upcomingDevices.map((device) => {
              return (
                <a
                  href={`/devices/${device.name.sanitized}`}
                  style={{ textDecoration: "none" }}
                >
                  <DeviceCardMedium device={device} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {Object.entries(devicesGroupedByYearAndMonth).map(([key, devices]) => (
        <div
          class="timeline-container"
          id={key}
        >
          <div class="timeline-dot"></div>
          <div
            class="timeline-text"
            onClick={() => {
              globalThis.location.hash = key;
              globalThis.navigator.clipboard.writeText(
                `${globalThis.location.origin}/release-timeline#${key}`,
              );
            }}
            data-tooltip="Click to copy link to this section"
          >
            <div>{getKeyName(key)}</div>
          </div>
          <div class="timeline-body">
            <div class="timeline-devices-grid">
              {devices.map((device) => {
                return (
                  <a
                    href={`/devices/${device.name.sanitized}`}
                    style={{ textDecoration: "none" }}
                  >
                    <DeviceCardMedium device={device} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
