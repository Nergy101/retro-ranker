import { Head, Partial } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { PaginationNav } from "../../components/shared/PaginationNav.tsx";
import { Tag as TagModel } from "../../data/models/tag.model.ts";
import { DeviceSearchForm } from "../../islands/forms/DeviceSearchForm.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function DevicesIndex(props: PageProps) {
  const deviceService = DeviceService.getInstance();

  const searchQuery = props.url?.searchParams?.get("search") || "";
  const searchCategory = props.url?.searchParams?.get("category") || "all";
  const pageNumber = parseInt(props.url?.searchParams?.get("page") || "1");
  const sortBy = props.url?.searchParams?.get("sort") as
    | "all"
    | "highly-rated"
    | "new-arrivals" ||
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

  const pageSize = 9;

  const allDevices = deviceService.getAllDevices();

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
  ].filter((tag) => tag !== null).filter((t) =>
    !initialTags.some((t2) => t2.slug === t.slug)
  ) as TagModel[];

  const pagedFilteredSortedDevices = deviceService.searchDevices(
    searchQuery,
    searchCategory as "all" | "low" | "mid" | "high",
    sortBy,
    filter,
    initialTags,
    pageNumber,
    pageSize,
  );

  const hasResults = pagedFilteredSortedDevices.page.length > 0;
  const pageResults = pagedFilteredSortedDevices.page;
  const amountOfResults = pagedFilteredSortedDevices.totalAmountOfResults;

  return (
    <div f-client-nav>
      <Head>
        <title>Retro Ranker - Device Catalog</title>
      </Head>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Device Catalog</h1>
          <p>
            Currently indexed{" "}
            <span style={{ color: "var(--pico-primary)" }}>
              {allDevices.length}
            </span>{" "}
            devices
          </p>
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
        />

        <hr />

        {hasResults
          ? (
            <PaginationNav
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalResults={amountOfResults}
              searchQuery={searchQuery}
              searchCategory={searchCategory}
              sortBy={sortBy}
              filter={filter}
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
            <div class="device-search-grid" f-client-nav={false}>
              {pageResults.map((device) => (
                <>
                  <a
                    href={`/devices/${device.name.sanitized}`}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                    }}
                  >
                    <DeviceCardMedium device={device} isActive={false} />
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
                pageSize={pageSize}
                totalResults={amountOfResults}
                searchQuery={searchQuery}
                searchCategory={searchCategory}
                sortBy={sortBy}
                filter={filter}
                tags={initialTags}
              />
            </div>
          )
          : null}
      </Partial>
    </div>
  );
}
