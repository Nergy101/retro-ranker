import SEO from "../../components/SEO.tsx";
import { PageProps } from "$fresh/server.ts";
import { PiCaretCircleDoubleDown } from "@preact-icons/pi";
import { Device } from "../../data/device.model.ts";
import { TimelineContent } from "../../islands/TimelineContent.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function ReleaseTimeline({ url }: PageProps) {
  const deviceService = DeviceService.getInstance();
  const devices = deviceService.getAllDevices();

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

  const devicesGroupedByYearAndMonth = sortedDevices.reduce((acc, device) => {
    const parsedDate = new Date(device.released.mentionedDate ?? 0);

    const year = parsedDate.getUTCFullYear();
    const month = parsedDate.getUTCMonth();

    acc[`${year}-${month}`] = [...(acc[`${year}-${month}`] || []), device];
    return acc;
  }, {} as Record<string, Device[]>);

  return (
    <div class="release-timeline-page">
      <SEO
        title="Retro Ranker - Release Timeline"
        description="Explore the release timeline of devices on Retro Ranker."
        url={`https://retroranker.site${url.pathname}`}
      />
      <h1 style={{ textAlign: "center" }}>Release Timeline</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center" }}
          data-tooltip="Scroll down to see the timeline"
          data-placement="bottom"
        >
          <PiCaretCircleDoubleDown />
        </div>
      </div>
      <TimelineContent
        upcomingDevices={upcomingDevices}
        devicesGroupedByYearAndMonth={devicesGroupedByYearAndMonth}
      />
    </div>
  );
}
