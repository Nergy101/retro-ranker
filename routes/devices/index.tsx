import SEO from "../../components/SEO.tsx";
import { Partial } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { DeviceCardLarge } from "../../components/cards/DeviceCardLarge.tsx";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceCardRow } from "../../components/cards/DeviceCardRow.tsx";
import { PaginationNav } from "../../components/shared/PaginationNav.tsx";
import { TagModel } from "../../data/models/tag.model.ts";
import { DeviceSearchForm } from "../../islands/forms/DeviceSearchForm.tsx";
import { LayoutSelector } from "../../islands/LayoutSelector.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function DevicesIndex(props: PageProps) {
  console.info("Route loaded: /devices");
  const deviceService = DeviceService.getInstance();

  const searchQuery = props.url?.searchParams?.get("search") || "";
  const searchCategory = props.url?.searchParams?.get("category") || "all";
  const pageNumber = parseInt(props.url?.searchParams?.get("page") || "1");
  const sortBy = props.url?.searchParams?.get("sort") as
    | "all"
    | "highly-ranked"
    | "new-arrivals"
    | "high-low-price"
    | "low-high-price"
    | "alphabetical"
    | "reverse-alphabetical" ||
    "all";

  const filter = props.url?.searchParams?.get("filter") as
    | "all"
    | "upcoming"
    | "personal-picks" ||
    "all";

  const tagsParam = props.url?.searchParams?.get("tags") || "";
  const parsedTags = tagsParam.split(",");

  const initialTags = parsedTags.map((slug) => deviceService.getTagBySlug(slug))
    .filter((tag) => tag !== null && tag.slug !== "") as TagModel[];

  const allDevices = deviceService.getAllDevices()
    .sort((a, b) => {
      const dateA = a.released.mentionedDate
        ? new Date(a.released.mentionedDate)
        : new Date(0);
      const dateB = b.released.mentionedDate
        ? new Date(b.released.mentionedDate)
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  const defaultTags = [
    deviceService.getTagBySlug("low"),
    deviceService.getTagBySlug("mid"),
    deviceService.getTagBySlug("high"),
    deviceService.getTagBySlug("upcoming"),
    deviceService.getTagBySlug("personal-pick"),
    deviceService.getTagBySlug("year-2025"),
    deviceService.getTagBySlug("year-2024"),
    deviceService.getTagBySlug("anbernic"),
    deviceService.getTagBySlug("miyoo-bittboy"),
    deviceService.getTagBySlug("ayaneo"),
    deviceService.getTagBySlug("steam-os"),
    deviceService.getTagBySlug("clamshell"),
    deviceService.getTagBySlug("horizontal"),
    deviceService.getTagBySlug("vertical"),
    deviceService.getTagBySlug("micro"),
  ].filter((tag) => tag !== null).filter((t) =>
    !initialTags.some((t2) => t2.slug === t.slug)
  ) as TagModel[];

  const activeLayout = props.url?.searchParams?.get("layout") as string ||
    "grid9";

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

  const pageSize = props.url?.searchParams?.get("pageSize")
    ? parseInt(
      props.url?.searchParams?.get("pageSize") ??
        getPageSize(activeLayout).toString(),
    )
    : getPageSize(activeLayout);

  const getMaxPageSize = () => {
    if (pageSize > 100) {
      return 10;
    }

    return pageSize;
  };

  const pagedFilteredSortedDevices = deviceService.searchDevices(
    searchQuery,
    searchCategory as "all" | "low" | "mid" | "high",
    sortBy,
    filter,
    initialTags,
    pageNumber,
    getMaxPageSize(),
  );

  const hasResults = pagedFilteredSortedDevices.page.length > 0;
  const pageResults = pagedFilteredSortedDevices.page;
  const amountOfResults = pagedFilteredSortedDevices.totalAmountOfResults;

  const hasNextPage =
    pageNumber < Math.ceil(amountOfResults / getPageSize(activeLayout));

  return (
    <div class="devices-page" f-client-nav>
      <SEO
        title="Device Catalog"
        description="Browse and compare retro gaming handhelds. Find detailed specifications, performance ratings, and prices for over 100 devices. Updated regularly with new releases."
        url={`https://retroranker.site${props.url.pathname}`}
        robots="noindex, follow"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://retroranker.site",
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Device Catalog",
                  "item": "https://retroranker.site/devices",
                },
              ],
            }),
          }}
        />
        {pageNumber > 1 && (
          <link
            rel="prev"
            href={`/devices?page=${pageNumber - 1}&category=${searchCategory}`}
          />
        )}
        {hasNextPage && (
          <link
            rel="next"
            href={`/devices?page=${pageNumber + 1}&category=${searchCategory}`}
          />
        )}
      </SEO>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Device Catalog</h1>
          <p>
            Search through{" "}
            <span style={{ color: "var(--pico-primary)" }}>
              {allDevices.length}
            </span>{" "}
            devices
          </p>
          <a
            f-client-nav={false}
            style={{ fontSize: "0.8rem" }}
            href="/devices/tags"
          >
            Search devices by all tags 🚧
          </a>
        </hgroup>
      </header>

      <Partial name="search-results">
        <DeviceSearchForm
          initialSearch={searchQuery}
          initialCategory={searchCategory}
          initialSort={sortBy}
          initialFilter={filter}
          initialPage={pageNumber}
          initialTags={initialTags}
          defaultTags={defaultTags}
          activeLayout={activeLayout}
        />

        <hr />
        <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
          The star rating shows the emulation performance of the device.
        </div>
        <div f-client-nav={false}>
          <LayoutSelector
            activeLayout={activeLayout}
            initialPageSize={pageSize}
            defaultPageSize={getPageSize(activeLayout)}
          />
        </div>

        {hasResults
          ? (
            <PaginationNav
              pageNumber={pageNumber}
              pageSize={getMaxPageSize()}
              totalResults={amountOfResults}
              searchQuery={searchQuery}
              searchCategory={searchCategory}
              sortBy={sortBy}
              filter={filter}
              activeLayout={activeLayout}
              tags={initialTags}
            />
          )
          : null}

        {!hasResults
          ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <p>No results found for your search criteria.</p>
            </div>
          )
          : (
            <div class={getLayoutGrid(activeLayout)} f-client-nav={false}>
              {pageResults.map((device) => (
                <>
                  <a
                    href={`/devices/${device.name.sanitized}`}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                    }}
                  >
                    {activeLayout === "grid9" && (
                      <DeviceCardMedium device={device} isActive={false} />
                    )}

                    {activeLayout === "grid4" && (
                      <DeviceCardLarge device={device} />
                    )}

                    {activeLayout === "list" && (
                      <DeviceCardRow device={device} />
                    )}
                  </a>
                </>
              ))}
            </div>
          )}

        {hasResults
          ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <PaginationNav
                pageNumber={pageNumber}
                pageSize={getMaxPageSize()}
                totalResults={amountOfResults}
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                sortBy={sortBy}
                filter={filter}
                activeLayout={activeLayout}
                tags={initialTags}
              />
            </div>
          )
          : null}
      </Partial>
    </div>
  );
}
