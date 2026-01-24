import { useEffect, useState } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { PerformanceVsPriceScatterPlot } from "../charts/performance-vs-price-scatter.tsx";
import { OperatingSystemDistribution } from "../charts/os-distribution.tsx";
import { PriceRangeDistribution } from "../charts/price-range-distribution.tsx";

interface CollectionTabsProps {
  devices: Device[];
  collectionType?: string;
  collectionOrder?: Array<Record<string, number>>;
}

export function CollectionTabs({
  devices,
  collectionType,
  collectionOrder,
}: CollectionTabsProps) {
  // Get initial tab from URL or default to "devices"
  const getInitialTab = (): "devices" | "charts" => {
    if (typeof window === "undefined") return "devices";
    const urlParams = new URLSearchParams(globalThis.location.search);
    const tab = urlParams.get("tab");
    return (tab === "charts" || tab === "devices") ? tab : "devices";
  };

  const [activeTab, setActiveTab] = useState<"devices" | "charts">(
    getInitialTab,
  );

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(globalThis.location.href);
    if (activeTab === "devices") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", activeTab);
    }
    // Use replaceState to avoid adding to history
    globalThis.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  const showTab = (tab: "devices" | "charts") => {
    setActiveTab(tab);
  };

  // Sort devices if ranked collection
  const sortedDevices = collectionType === "Ranked"
    ? [...devices].sort((a, b) => {
      const aOrder = collectionOrder?.find((o) => o[a.id])?.[a.id];
      const bOrder = collectionOrder?.find((o) => o[b.id])?.[b.id];
      return (aOrder ?? 0) - (bOrder ?? 0);
    })
    : devices;

  return (
    <div class="tab-container">
      <div class="tab-buttons">
        <button
          type="button"
          class={`tab-button ${activeTab === "devices" ? "active" : ""}`}
          onClick={() => showTab("devices")}
        >
          Devices
        </button>
        <button
          type="button"
          class={`tab-button ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => showTab("charts")}
        >
          Charts
        </button>
      </div>

      <div
        id="tab-devices"
        class={`tab-content ${activeTab === "devices" ? "active" : ""}`}
      >
        <div class="collection-devices-grid">
          {sortedDevices.map((device: Device) => (
            <a href={`/devices/${device.id}`}>
              <DeviceCardMedium device={device} key={device.id} />

              {collectionType === "Ranked" && (
                <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                  # {collectionOrder?.find((o) =>
                    o[device.id]
                  )?.[device.id]}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>

      <div
        id="tab-charts"
        class={`tab-content ${activeTab === "charts" ? "active" : ""}`}
      >
        {devices.length > 0 && (
          <section style={{ padding: "0 1rem" }}>
            <hgroup style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2>Collection Analytics</h2>
              <p>
                Visual insights into the devices in this collection
              </p>
            </hgroup>
            <div class="chart-wrapper" style={{ marginBottom: "3rem" }}>
              <PerformanceVsPriceScatterPlot devices={devices} />
            </div>
            <hr />
            <div
              class="chart-wrapper"
              style={{ marginTop: "3rem", marginBottom: "3rem" }}
            >
              <OperatingSystemDistribution devices={devices} />
            </div>
            <hr />
            <div class="chart-wrapper" style={{ marginTop: "3rem" }}>
              <PriceRangeDistribution devices={devices} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
