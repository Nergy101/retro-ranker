import { PageProps } from "$fresh/server.ts";
import { DeviceCardMedium } from "../../components/DeviceCardMedium.tsx";
import { PaginationNav } from "../../components/PaginationNav.tsx";
import { DeviceSearchForm } from "../../islands/DeviceSearchForm.tsx";
import { DeviceService } from "../../data/devices/device.service.ts";

export default function DevicesIndex(props: PageProps) {
  const deviceService = DeviceService.getInstance();

  const searchQuery = props.url?.searchParams?.get("search") || "";
  const searchCategory = props.url?.searchParams?.get("category") || "all";
  const pageNumber = parseInt(props.url?.searchParams?.get("page") || "1");
  const sortBy = props.url?.searchParams?.get("sort") as
    | "all"
    | "upcoming"
    | "highly-rated"
    | "personal-picks" ||
    "all";
  const pageSize = 9;

  const allDevices = deviceService.getAllDevices();

  const pagedFilteredSortedDevices = deviceService.searchDevices(
    searchQuery,
    searchCategory as "all" | "low" | "mid" | "high",
    sortBy,
    pageNumber,
    pageSize,
  );

  const hasResults = pagedFilteredSortedDevices.page.length > 0;
  const pageResults = pagedFilteredSortedDevices.page;
  const amountOfResults = pagedFilteredSortedDevices.totalAmountOfResults;

  return (
    <div>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Device Catalog</h1>
          <p>Currently indexed {allDevices.length} devices</p>
        </hgroup>
      </header>

      <DeviceSearchForm
        initialSearch={searchQuery}
        initialCategory={searchCategory}
        initialPage={pageNumber}
      />

      {hasResults
        ? (
          <PaginationNav
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalResults={amountOfResults}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
            sortBy={sortBy}
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
          <div class="device-search-grid">
            {pageResults.map((device) => <DeviceCardMedium device={device} />)}
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
            />
          </div>
        )
        : null}
    </div>
  );
}
