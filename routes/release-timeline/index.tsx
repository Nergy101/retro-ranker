import { Head } from "$fresh/runtime.ts";
import { PiCaretCircleDoubleLeft } from "@preact-icons/pi";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { Device } from "../../data/device.model.ts";
import { DeviceService } from "../../services/devices/device.service.ts";
import { PageProps } from "$fresh/server.ts";

export default function ReleaseTimeline(props: PageProps) {
  const yearsToShow = props.url.searchParams.get("years");

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

  const upcomingDevices = devices.filter((device) => {
    return device.released.raw?.toLowerCase().includes("upcoming");
  });

  let devicesGroupedByYearAndMonth = sortedDevices.reduce((acc, device) => {
    const parsedDate = new Date(device.released.mentionedDate ?? 0);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    if (!year || !month) return acc;
    acc[`${year}-${month}`] = [...(acc[`${year}-${month}`] || []), device];
    return acc;
  }, {} as Record<string, Device[]>);

  if (yearsToShow !== null) {
    devicesGroupedByYearAndMonth = Object.fromEntries(
      Object.entries(devicesGroupedByYearAndMonth).filter(([key]) =>
        key.startsWith(yearsToShow)
      ),
    );
  }

  if (yearsToShow === "upcoming") {
    devicesGroupedByYearAndMonth["upcoming"] = upcomingDevices;
  }

  const getAllYears = () => {
    return Array.from(
      new Set(
        devices.map((device) =>
          new Date(device.released.mentionedDate ?? 0).getFullYear().toString()
        ),
      ),
    ).reverse();
  };

  const renderTimeLine = () => {
    if (yearsToShow === null) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p>Select a year to view the release timeline.</p>
        </div>
      );
    }

    return (
      <div class="timeline-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            data-tooltip="Scroll left to go back in time"
            data-placement="bottom"
          >
            <PiCaretCircleDoubleLeft />
          </span>
        </div>
        <div class="timeline">
          {Object.entries(devicesGroupedByYearAndMonth).map((
            [date, devices],
          ) => (
            <div class="timeline-month">
              <h2>
                {date === "upcoming"
                  ? "Upcoming"
                  : new Date(date).toLocaleString("default", {
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
    );
  };

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
          <span>Device Release Timeline</span>
        </div>
      </h1>

      <div class="year-selection tags">
        {getAllYears().map((year) => (
          <a href={`/release-timeline?years=${year}`}>{year}</a>
        ))}
        <a href="/release-timeline?years=upcoming">Upcoming</a>
      </div>

      {renderTimeLine()}
    </div>
  );
}
