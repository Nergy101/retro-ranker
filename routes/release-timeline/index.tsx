import { PiCaretCircleDoubleDown } from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import { createSuperUserPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { TimelineContent } from "@islands/devices/timeline-content.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

const chunkArray = (arr: any[], size: number): any[][] => {
  const chunks: any[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

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

    const deviceIds = devices.map((d) => d.id);
    const pb = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );

    const likeRecords = [] as any[];
    if (deviceIds.length > 0) {
      for (const chunk of chunkArray(deviceIds, 100)) {
        const likesFilter = chunk.map((id) => `device="${id}"`).join(" || ");
        const records = await pb.getAll("device_likes", {
          filter: likesFilter,
          expand: "",
          sort: "",
        });
        likeRecords.push(...records);
      }
    }

    const likesCountMap: Record<string, number> = {};
    const userLikedMap: Record<string, boolean> = {};
    const currentUser = (ctx.state as CustomFreshState).user as User | null;
    for (const r of likeRecords) {
      likesCountMap[r.device] = (likesCountMap[r.device] || 0) + 1;
      if (currentUser && r.user === currentUser.id) {
        userLikedMap[r.device] = true;
      }
    }

    const favoriteRecords = [] as any[];
    if (currentUser && deviceIds.length > 0) {
      for (const chunk of chunkArray(deviceIds, 100)) {
        const favoritesFilter = `user="${currentUser.id}" && (` +
          chunk.map((id) => `device="${id}"`).join(" || ") +
          ")";
        const records = await pb.getAll("device_favorites", {
          filter: favoritesFilter,
          expand: "",
          sort: "",
        });
        favoriteRecords.push(...records);
      }
    }
    const userFavoritedMap: Record<string, boolean> = {};
    for (const r of favoriteRecords) {
      userFavoritedMap[r.device] = true;
    }

    (ctx.state as CustomFreshState).data = {
      upcomingDevices,
      devicesGroupedByYearAndMonth,
      likesCountMap,
      userLikedMap,
      userFavoritedMap,
    };

    return page(ctx);
  },
};

export default function ReleaseTimeline(ctx: FreshContext) {
  const {
    upcomingDevices,
    devicesGroupedByYearAndMonth,
    likesCountMap,
    userLikedMap,
    userFavoritedMap,
  } = (ctx.state as CustomFreshState).data as {
    upcomingDevices: Device[];
    devicesGroupedByYearAndMonth: Record<string, Device[]>;
    likesCountMap: Record<string, number>;
    userLikedMap: Record<string, boolean>;
    userFavoritedMap: Record<string, boolean>;
  };
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const language = (ctx.state as CustomFreshState).language ?? "en-US";
  const user = (ctx.state as CustomFreshState).user as User | null;

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
        <h1 style={{ textAlign: "center" }}>
          {TranslationPipe(translations, "releases.title")}
        </h1>
        <p>
          {TranslationPipe(translations, "releases.description")}
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
          data-tooltip={TranslationPipe(translations, "releases.scrollTooltip")}
          data-placement="bottom"
        >
          <PiCaretCircleDoubleDown />
        </div>
      </div>
      <TimelineContent
        upcomingDevices={upcomingDevices}
        devicesGroupedByYearAndMonth={devicesGroupedByYearAndMonth}
        isLoggedIn={!!user}
        likesCountMap={likesCountMap}
        userLikedMap={userLikedMap}
        userFavoritedMap={userFavoritedMap}
        translations={translations}
        language={language}
      />
    </div>
  );
}
