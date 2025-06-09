import { PiCaretCircleDoubleDown } from "@preact-icons/pi";
import { FreshContext, page, PageProps } from "fresh";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { TimelineContent } from "@islands/devices/timeline-content.tsx";

export const handler = {
  async GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Gaming Handheld Release Timeline",
      description:
        "Explore the complete chronological release timeline of retro gaming handhelds. Track upcoming releases, view historical launch dates, and discover the evolution of portable emulation devices over time.",
      url: `https://retroranker.site${ctx.url.pathname}`,
      keywords:
        "retro gaming timeline, handheld release dates, emulation device history, upcoming retro handhelds, retro console releases, gaming device roadmap, retro gaming calendar, handheld launch dates",
    };

    return page(ctx);
  },
};

export default async function ReleaseTimeline({ url: _url }: PageProps) {
  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

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
      {
        /* <SEO
        title="Gaming Handheld Release Timeline"
        description="Explore the complete chronological release timeline of retro gaming handhelds. Track upcoming releases, view historical launch dates, and discover the evolution of portable emulation devices over time."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro gaming timeline, handheld release dates, emulation device history, upcoming retro handhelds, retro console releases, gaming device roadmap, retro gaming calendar, handheld launch dates"
      /> */
      }
      <hgroup>
        <h1 style={{ textAlign: "center" }}>Release Timeline</h1>
        <p>
          Scroll down to see the complete chronological release timeline of
          retro gaming handhelds.
        </p>
      </hgroup>

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
