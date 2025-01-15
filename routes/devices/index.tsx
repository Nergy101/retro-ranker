import { Partial } from "$fresh/runtime.ts";
import { FreshContext } from "$fresh/server.ts";
import { DeviceCardMedium } from "../../components/DeviceCardMedium.tsx";
import { PaginationNav } from "../../components/PaginationNav.tsx";
import { getAllDevices } from "../../data/device.service.ts";
import { DeviceSearchForm } from "../../islands/DeviceSearchForm.tsx";

//! TODO: make all other routes also work like this
export default async function DevicesIndex(_req: Request, ctx: FreshContext) {
  const allDevices = getAllDevices();
  const searchQuery = ctx.url?.searchParams.get("search") || "";
  const searchCategory = ctx.url?.searchParams.get("category") || "all";
  const pageNumber = parseInt(ctx.url?.searchParams.get("page") || "1");

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

      <Partial name="devices">
        <DeviceSearchForm
          initialSearch={searchQuery}
          initialCategory={searchCategory}
          initialPage={pageNumber}
        />

        <PaginationNav
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalResults={amountOfResults}
          searchQuery={searchQuery}
          searchCategory={searchCategory}
        />

        <div class="device-search-grid">
          {getPagedDevices().map((device) => (
            <DeviceCardMedium
              device={device}
            />
          ))}
        </div>

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
      </Partial>
    </div>
  );
}
