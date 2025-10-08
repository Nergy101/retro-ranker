import { Context, FreshContext, page } from "fresh";
import { DeviceCardLarge } from "../../components/cards/device-card-large.tsx";
import { DeviceCardRow } from "../../components/cards/device-card-row.tsx";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { PaginationNav } from "../../components/shared/pagination-nav.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { createSuperUserPocketBaseService } from "../../data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "../../interfaces/state.ts";
import { DeviceSearchForm } from "../../islands/forms/device-search-form.tsx";
import { LayoutSelector } from "../../islands/forms/layout-selector.tsx";
import { TagTypeahead } from "../../islands/forms/tag-type-ahead.tsx";
import { CollapsibleTagList } from "../../islands/forms/collapsible-tag-list.tsx";
import { logJson } from "../../data/tracing/tracer.ts";
import { State } from "../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const startTime = performance.now();
    const url = new URL(ctx.req.url);
    const path = url.pathname;

    logJson("info", "Devices Page Handler Started", {
      path,
      timestamp: new Date().toISOString(),
      query: Object.fromEntries(url.searchParams),
    });

    (ctx.state as CustomFreshState).seo = {
      title: "Retro Gaming Handheld Device Catalog | Retro Ranker",
      description:
        "Browse our comprehensive catalog of 400+ retro gaming handhelds with detailed specifications, reviews, and comparisons. Filter by price, brand, release year, and features to find your perfect portable emulation device.",
      keywords:
        "retro gaming handhelds catalog, emulation devices database, retro console comparison, handheld gaming systems, retro gaming devices, Anbernic devices, Miyoo handhelds, Steam Deck, retro gaming specs, portable emulation systems, handheld device reviews, retro gaming database",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };

    const deviceServiceStart = performance.now();
    const deviceService = await DeviceService.getInstance();
    const deviceServiceEnd = performance.now();

    logJson("info", "DeviceService Instance Created", {
      path,
      deviceServiceTime: `${
        (deviceServiceEnd - deviceServiceStart).toFixed(2)
      }ms`,
    });

    const searchParams = new URLSearchParams(ctx.url.search);

    // Tag selection logic (Advanced Tag Search)
    const tagsStart = performance.now();
    const tagsParam = searchParams.get("tags");
    const parsedTags = tagsParam ? tagsParam.split(",") : [];
    const allTags = await deviceService.getAllTags();
    const selectedTags = parsedTags
      .map((slug) =>
        allTags.find((t) => t.slug.toLowerCase() === slug.toLowerCase()) ?? null
      )
      .filter((tag) => tag !== null) as TagModel[];
    const tagsEnd = performance.now();

    logJson("info", "Tags Processing Completed", {
      path,
      tagsTime: `${(tagsEnd - tagsStart).toFixed(2)}ms`,
      selectedTagsCount: selectedTags.length,
      parsedTagsCount: parsedTags.length,
    });

    const searchQuery = searchParams.get("search") || "";
    const searchCategory =
      searchParams.get("category") as "all" | "low" | "mid" | "high" || "all";
    const sortBy = searchParams.get("sort") as
      | "new-arrivals"
      | "high-low-price"
      | "low-high-price"
      | "alphabetical"
      | "reverse-alphabetical"
      | "highly-ranked";
    const filter =
      searchParams.get("filter") as "all" | "upcoming" | "personal-picks" ||
      "all";

    // Layout and pagination
    const urlLayout = searchParams.get("layout") as string;
    const activeLayout = urlLayout || "grid9";
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const getPageSize = (activeLayout: string) => {
      switch (activeLayout) {
        case "grid9":
          return 9;
        case "grid4":
          return 4;
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
    const devicesWithTagsStart = performance.now();
    const searchResult = await deviceService.searchDevices(
      searchQuery,
      searchCategory,
      sortBy,
      filter,
      selectedTags.filter((tag) => tag !== null) as TagModel[],
      pageNumber,
      getMaxPageSize(),
    );
    const devicesWithTagsEnd = performance.now();

    logJson("info", "Devices with Tags Retrieved", {
      path,
      devicesWithTagsTime: `${
        (devicesWithTagsEnd - devicesWithTagsStart).toFixed(2)
      }ms`,
      totalDevices: searchResult.totalAmountOfResults,
      pageResults: searchResult.page.length,
      selectedTagsCount: selectedTags.length,
      searchQuery,
      sortBy,
    });

    const totalAmountOfResults = searchResult.totalAmountOfResults;
    const pageResults = searchResult.page;

    // Likes and favorites data
    const deviceIds = pageResults.map((d) => d.id);
    const pbStart = performance.now();
    const pb = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );
    const pbEnd = performance.now();

    logJson("info", "PocketBase SuperUser Service Created", {
      path,
      pocketbaseTime: `${(pbEnd - pbStart).toFixed(2)}ms`,
      deviceIdsCount: deviceIds.length,
    });

    const likesStart = performance.now();
    const likesFilter = deviceIds.map((id) => `device="${id}"`).join(" || ");
    const likeRecords = deviceIds.length > 0
      ? await pb.getAll("device_likes", {
        filter: likesFilter,
        expand: "",
        sort: "",
      })
      : [];
    const likesEnd = performance.now();

    logJson("info", "Device Likes Retrieved", {
      path,
      likesTime: `${(likesEnd - likesStart).toFixed(2)}ms`,
      likeRecordsCount: likeRecords.length,
      likesFilter,
    });

    const likesCountMap: Record<string, number> = {};
    const userLikedMap: Record<string, boolean> = {};
    const currentUser = (ctx.state as CustomFreshState).user as User | null;
    for (const r of likeRecords) {
      likesCountMap[r.device] = (likesCountMap[r.device] || 0) + 1;
      if (currentUser && r.user === currentUser.id) {
        userLikedMap[r.device] = true;
      }
    }

    const favoritesStart = performance.now();
    const favoritesFilter = currentUser
      ? `user="${currentUser.id}" && (` +
        deviceIds.map((id) => `device="${id}"`).join(" || ") +
        ")"
      : "";
    const favoriteRecords = currentUser && deviceIds.length > 0
      ? await pb.getAll("device_favorites", {
        filter: favoritesFilter,
        expand: "",
        sort: "",
      })
      : [];
    const favoritesEnd = performance.now();

    logJson("info", "Device Favorites Retrieved", {
      path,
      favoritesTime: `${(favoritesEnd - favoritesStart).toFixed(2)}ms`,
      favoriteRecordsCount: favoriteRecords.length,
      hasCurrentUser: !!currentUser,
      favoritesFilter: favoritesFilter || "none",
    });

    const userFavoritedMap: Record<string, boolean> = {};
    for (const r of favoriteRecords) {
      userFavoritedMap[r.device] = true;
    }

    // For TagTypeahead - show all tags except selected ones
    const availableTagsStart = performance.now();
    const availableTagsEnd = performance.now();

    logJson("info", "Available Tags Processed", {
      path,
      availableTagsTime: `${
        (availableTagsEnd - availableTagsStart).toFixed(2)
      }ms`,
    });

    const totalEnd = performance.now();
    logJson("info", "Devices Page Handler Completed", {
      path,
      totalHandlerTime: `${(totalEnd - startTime).toFixed(2)}ms`,
      breakdown: {
        deviceService: `${
          (deviceServiceEnd - deviceServiceStart).toFixed(2)
        }ms`,
        tags: `${(tagsEnd - tagsStart).toFixed(2)}ms`,
        devicesWithTags: `${
          (devicesWithTagsEnd - devicesWithTagsStart).toFixed(2)
        }ms`,
        pocketbase: `${(pbEnd - pbStart).toFixed(2)}ms`,
        likes: `${(likesEnd - likesStart).toFixed(2)}ms`,
        favorites: `${(favoritesEnd - favoritesStart).toFixed(2)}ms`,
        availableTags: `${
          (availableTagsEnd - availableTagsStart).toFixed(2)
        }ms`,
      },
      results: {
        totalDevices: searchResult.totalAmountOfResults,
        pageResults: searchResult.page.length,
        hasResults: searchResult.page.length > 0,
        selectedTagsCount: selectedTags.length,
      },
    });

    (ctx.state as CustomFreshState).data = {
      allTags,
      selectedTags,
      devicesWithSelectedTags: pageResults,
      pageResults,
      totalAmountOfResults,
      pageNumber,
      pageSize: getMaxPageSize(),
      activeLayout,
      hasResults: searchResult.page.length > 0,
      user: (ctx.state as CustomFreshState).user,
      likesCountMap,
      userLikedMap,
      userFavoritedMap,
      searchQuery,
      searchParams,
      searchCategory,
      sortBy,
      filter,
    };

    return page(ctx);
  },
};

export default function CatalogPage(ctx: FreshContext) {
  const data = (ctx.state as CustomFreshState).data;
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  const allTags = data.allTags as TagModel[];
  const selectedTags = data.selectedTags as TagModel[];
  const pageResults = data.pageResults as Device[];
  const totalAmountOfResults = data.totalAmountOfResults;
  const pageNumber = data.pageNumber;
  const pageSize = data.pageSize;
  const activeLayout = data.activeLayout;
  const hasResults = data.hasResults;
  const user = data.user as User | null;
  const likesCountMap = data.likesCountMap as Record<string, number>;
  const userLikedMap = data.userLikedMap as Record<string, boolean>;
  const userFavoritedMap = data.userFavoritedMap as Record<string, boolean>;
  const searchQuery = data.searchQuery;
  const searchCategory = data.searchCategory;
  const sortBy = data.sortBy;
  const filter = data.filter;
  const url = new URL(ctx.req.url);

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
        return 4;
      default:
        return 20;
    }
  };

  return (
    <div class="devices-page">
      <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <hgroup>
          <h1>Device Catalog</h1>
          <p
            style={{
              fontFamily: "var(--font-sans) !important",
              letterSpacing: "0.03em",
            }}
          >
            Browse our catalog of retro gaming handhelds with specs.
            <br />Don't know where to start? Check out our{" "}
            <a href="/articles/bang-for-your-buck">Best Value</a> article.
          </p>
        </hgroup>
      </header>
      <div class="devices-catalog-flex">
        {/* Sidebar */}
        <aside class="devices-catalog-sidebar">
          <div style={{ flex: 1 }}>
            <LayoutSelector
              activeLayout={activeLayout}
              initialPageSize={pageSize}
              defaultPageSize={getPageSize(activeLayout)}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <TagTypeahead
              allTags={allTags}
              initialSelectedTags={selectedTags}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <CollapsibleTagList
              allTags={allTags}
              selectedTags={selectedTags}
              baseUrl={url.origin}
              translations={translations}
            />
          </div>
        </aside>
        {/* Main Content */}
        <main class="devices-catalog-main">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <DeviceSearchForm
                initialSearch={searchQuery}
                initialCategory={searchCategory}
                _initialPage={pageNumber}
                initialSort={sortBy}
                initialFilter={filter}
                _initialTags={selectedTags}
              />
            </div>
          </div>
          {hasResults && (
            <PaginationNav
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalResults={totalAmountOfResults}
              searchQuery={searchQuery}
              searchCategory={searchCategory}
              sortBy={sortBy}
              filter={filter}
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
                <p>
                  No devices found matching your criteria. Try adjusting your
                  filters or search terms.
                </p>
              </div>
            )
            : (
              <div
                class={`${getLayoutGrid(activeLayout)} device-search-grid`}
                f-client-nav={false}
              >
                {pageResults.map((device) => (
                  <a
                    href={`/devices/${device.name.sanitized}`}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    {activeLayout === "grid9" && (
                      <DeviceCardMedium
                        device={device}
                        isActive={false}
                      />
                    )}
                    {activeLayout === "grid4" && (
                      <DeviceCardLarge
                        device={device}
                        isLoggedIn={!!user}
                        likes={likesCountMap[device.id] ?? 0}
                        isLiked={userLikedMap[device.id] ?? false}
                        isFavorited={userFavoritedMap[device.id] ?? false}
                      />
                    )}
                    {activeLayout === "list" && (
                      <DeviceCardRow
                        device={device}
                        isLoggedIn={!!user}
                        likes={likesCountMap[device.id] ?? 0}
                        isLiked={userLikedMap[device.id] ?? false}
                        isFavorited={userFavoritedMap[device.id] ?? false}
                      />
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
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                sortBy={sortBy}
                filter={filter}
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
