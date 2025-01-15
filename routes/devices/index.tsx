import { PageProps } from "$fresh/server.ts";
import { DeviceCardMedium } from "../../components/DeviceCardMedium.tsx";
import { PaginationNav } from "../../components/PaginationNav.tsx";
import { getAllDevices } from "../../data/device.service.ts";
import { DeviceSearchForm } from "../../islands/DeviceSearchForm.tsx";

export default function DevicesIndex(props: PageProps) {
  const allDevices = getAllDevices();
  const searchQuery = props.url?.searchParams?.get("search") || "";
  const searchCategory = props.url?.searchParams?.get("category") || "all";
  const pageNumber = parseInt(props.url?.searchParams?.get("page") || "1");

  const pageSize = 9;

  const totalFilteredDevices = allDevices.filter((device) => {
    if (searchCategory === "all") {
      return (
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return (
      (device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase())) &&
      device.pricingCategory?.toLowerCase().includes(
        searchCategory.toLowerCase(),
      )
    );
  });

  const getPagedDevices = () => {
    if (!totalFilteredDevices) return [];

    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return totalFilteredDevices.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      ); // Show first devices when no search
    }

    return totalFilteredDevices
      .slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };

  const amountOfResults = totalFilteredDevices.length;

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

      {getPagedDevices().length > 0
        ? (
          <PaginationNav
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalResults={amountOfResults}
            searchQuery={searchQuery}
            searchCategory={searchCategory}
          />
        )
        : null}

      {getPagedDevices().length === 0
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
            {getPagedDevices().map((device) => (
              <DeviceCardMedium device={device} />
            ))}
          </div>
        )}

      {getPagedDevices().length > 0
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
            />
          </div>
        )
        : null}
    </div>
  );
}
