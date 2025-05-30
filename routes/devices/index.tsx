import { FreshContext, PageProps } from "$fresh/server.ts";
import { DeviceCardLarge } from "../../components/cards/DeviceCardLarge.tsx";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceCardRow } from "../../components/cards/DeviceCardRow.tsx";
import SEO from "../../components/SEO.tsx";
import { PaginationNav } from "../../components/shared/PaginationNav.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { LayoutSelector } from "../../islands/layout-selector.tsx";
import TagTypeahead from "../../islands/tag-typeahead.tsx";

export const handler = {
  async GET(_: Request, ctx: FreshContext) {
    const deviceService = await DeviceService.getInstance();
    const searchParams = new URLSearchParams(ctx.url.search);

    // Tag selection logic (Advanced Tag Search)
    const tagsParam = searchParams.get("tags");
    const parsedTags = tagsParam ? tagsParam.split(",") : [];
    const allTags = await deviceService.getAllTags();
    const selectedTags = parsedTags
      .map((slug) => allTags.find((t) => t.slug === slug) ?? null)
      .filter((tag) => tag !== null) as TagModel[];

    // Layout and pagination
    const urlLayout = searchParams.get("layout") as string;
    const activeLayout = urlLayout || "grid9";
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const getPageSize = (activeLayout: string) => {
      switch (activeLayout) {
        case "grid9":
          return 9;
        case "grid4":
          return 8;
        default:
          return 20;
      }
    };
    const pageSize = searchParams.get("pageSize")
      ? parseInt(
        searchParams.get("pageSize") ??
          getPageSize(activeLayout).toString(),
      )
      : getPageSize(activeLayout);
    const getMaxPageSize = () => {
      if (pageSize > 100) {
        return 20;
      }
      return pageSize;
    };

    // Devices filtered by selected tags
    const allDevicesWithTags = await deviceService.getDevicesWithTags(
      selectedTags.filter((tag) => tag !== null) as TagModel[],
    );

    const totalAmountOfResults = allDevicesWithTags.length;
    const startIdx = (pageNumber - 1) * getMaxPageSize();
    const endIdx = startIdx + getMaxPageSize();

    const pageResults = allDevicesWithTags.slice(startIdx, endIdx);

    const hasResults = pageResults.length > 0;
    const hasNextPage =
      pageNumber < Math.ceil(totalAmountOfResults / getPageSize(activeLayout));

    // For TagTypeahead
    const getAvailableTags = async () => {
      const allTags = await deviceService.getAllTags();
      const selectedTagSlugs = selectedTags.map((tag) => tag.slug);

      const availableTags = allTags.filter(async (tag) => {
        // Exclude already selected tags
        if (selectedTagSlugs.includes(tag.slug)) {
          return false;
        }

        // // Check if the tag is available in the resulting devices
        // const devicesWithTag = await deviceService.getDevicesWithTags([
        //   ...selectedTags,
        //   tag,
        // ]);
        // return devicesWithTag.length > 0;
        return true;
      });

      return availableTags;
    };

    const allAvailableTags = await getAvailableTags();

    return ctx.render({
      allAvailableTags,
      selectedTags,
      devicesWithSelectedTags: allDevicesWithTags, // for TagTypeahead
      // For paginated view
      pageResults,
      totalAmountOfResults,
      pageNumber,
      pageSize: getMaxPageSize(),
      activeLayout,
      hasResults,
      hasNextPage,
      user: ctx.state.user,
    });
  },
};

export default function CatalogPage({ url, data }: PageProps) {
  const allAvailableTags = data.allAvailableTags;
  const selectedTags = data.selectedTags;
  const pageResults = data.pageResults as Device[];
  const totalAmountOfResults = data.totalAmountOfResults;
  const pageNumber = data.pageNumber;
  const pageSize = data.pageSize;
  const activeLayout = data.activeLayout;
  const hasResults = data.hasResults;
  const hasNextPage = data.hasNextPage;
  const user = data.user;

  const getLayoutGrid = (layout: string) => {
    if (layout === "grid9") {
      return "device-search-grid-9";
    }
    if (layout === "grid4") {
      return "device-search-grid-4";
    }
    return "device-search-list";
  };
  const getPageSize = (activeLayout: string) => {
    switch (activeLayout) {
      case "grid9":
        return 9;
      case "grid4":
        return 8;
      default:
        return 20;
    }
  };

  return (
    <div class="devices-page">
      <SEO
        title="Device Catalog"
        description="Browse our catalog of retro gaming handhelds with specs."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro gaming handhelds, emulation devices, retro console comparison, handheld gaming systems, retro gaming devices catalog, Anbernic devices, Miyoo handhelds, retro gaming specs, portable emulation systems"
      />
      <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <hgroup>
          <h1>Device Catalog</h1>
          <p>
            Filter by tags to find devices. Combine tags for advanced filtering.
          </p>
        </hgroup>
      </header>
      <div class="devices-catalog-flex">
        {/* Sidebar */}
        <aside class="devices-catalog-sidebar">
          <div style={{ marginBottom: "2rem" }}>
            <TagTypeahead
              allTags={allAvailableTags}
              initialSelectedTags={selectedTags}
            />
          </div>
          {/* Add more filters here in the future */}
        </aside>
        {/* Main Content */}
        <main class="devices-catalog-main">
          <div style={{ marginBottom: "1rem" }}>
            <LayoutSelector
              activeLayout={activeLayout}
              initialPageSize={pageSize}
              defaultPageSize={getPageSize(activeLayout)}
            />
          </div>
          {hasResults && (
            <PaginationNav
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalResults={totalAmountOfResults}
              searchQuery=""
              searchCategory="all"
              sortBy="all"
              filter="all"
              activeLayout={activeLayout}
              tags={selectedTags}
            />
          )}
          {!hasResults
            ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <p>No results found for your selected tags.</p>
              </div>
            )
            : (
              <div class={getLayoutGrid(activeLayout)} f-client-nav={false}>
                {pageResults.map((device) => (
                  <a
                    href={`/devices/${device.name.sanitized}`}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    {activeLayout === "grid9" && (
                      <DeviceCardMedium
                        device={device}
                        isActive={false}
                        user={user}
                      />
                    )}
                    {activeLayout === "grid4" && (
                      <DeviceCardLarge
                        device={device}
                      />
                    )}
                    {activeLayout === "list" && (
                      <DeviceCardRow device={device} />
                    )}
                  </a>
                ))}
              </div>
            )}
          {hasResults && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <PaginationNav
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalResults={totalAmountOfResults}
                searchQuery=""
                searchCategory="all"
                sortBy="all"
                filter="all"
                activeLayout={activeLayout}
                tags={selectedTags}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
