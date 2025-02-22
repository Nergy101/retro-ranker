import { Head } from "$fresh/runtime.ts";
import { PiCaretCircleDoubleLeft } from "@preact-icons/pi";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/device.model.ts";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function ReleaseTimeline() {
  const deviceService = DeviceService.getInstance();
  const devices = deviceService.getAllDevices();

  // Sort devices by release date, oldest to newest
  const sortedDevices = devices.sort((a, b) => {
    const dateA = a.released.mentionedDate
      ? new Date(a.released.mentionedDate)
      : new Date(0);
    const dateB = b.released.mentionedDate
      ? new Date(b.released.mentionedDate)
      : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  const devicesGroupedByYearAndMonth = sortedDevices.reduce((acc, device) => {
    const parsedDate = new Date(device.released.mentionedDate ?? 0);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    if (!year || !month) return acc;
    acc[`${year}-${month}`] = [...(acc[`${year}-${month}`] || []), device];
    return acc;
  }, {} as Record<string, Device[]>);

  const upcomingDevices = devices.filter((device) => {
    return device.released.raw?.toLowerCase().includes("upcoming");
  });

  return (
    <div class="release-timeline-page">
      <Head>
        <title>Retro Ranker - Device Release Timeline</title>
        <meta
          name="description"
          content="Explore the release timeline of all devices in the Retro Ranker database."
        />
      </Head>
      <h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            data-tooltip="Scroll left to go back in time"
            data-placement="bottom"
          >
            <PiCaretCircleDoubleLeft />
          </span>
          <span>Device Release Timeline</span>
        </div>
      </h1>
      <div class="timeline-container">
        <div class="timeline">
          {/* Upcoming Devices Section */}
          {upcomingDevices.length > 0 && (
            <div class="timeline-month">
              <h2>Upcoming</h2>
              <div class="timeline-items">
                {upcomingDevices.map((device) => (
                  <div class="timeline-item">
                    <a href={`/devices/${device.name.sanitized}`}>
                      <DeviceCardMedium device={device} isActive={false} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Released Devices Section */}
          {Object.entries(devicesGroupedByYearAndMonth).map((
            [date, devices],
          ) => (
            <div class="timeline-month">
              <h2>
                {new Date(date).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div class="timeline-items">
                {devices.map((device) => (
                  <div class="timeline-item">
                    <a href={`/devices/${device.name.sanitized}`}>
                      <DeviceCardMedium device={device} isActive={false} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
