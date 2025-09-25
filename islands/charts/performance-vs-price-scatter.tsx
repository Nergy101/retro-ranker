import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface ScatterPlotProps {
  devices: Device[];
}

export function PerformanceVsPriceScatterPlot({ devices }: ScatterPlotProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [brandSelectionMode, setBrandSelectionMode] = useState<
    "top8" | "manual"
  >("top8");
  const brandSearchTerm = useSignal("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowBrandDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Generate stable colors for brands
  const getBrandColor = (brand: string): string => {
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = hash % 360;
    if (hue < 0) {
      hue += 360;
    }
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Get available brands and their device counts
  const availableBrands = useMemo(() => {
    const brandCounts: { [key: string]: number } = {};
    devices.forEach((device) => {
      if (
        device.totalRating > 0 && device.pricing.average &&
        device.pricing.average > 0 && !device.pricing.discontinued
      ) {
        const brand = device.brand.sanitized;
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      }
    });

    return Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([brand, count]) => ({ brand, count }));
  }, [devices]);

  // Get top brands (those with most devices)
  const topBrands = useMemo(() => {
    return availableBrands.slice(0, 8).map((b) => b.brand);
  }, [availableBrands]);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    console.log("Filtering with search term:", brandSearchTerm.value);
    if (!brandSearchTerm.value.trim()) {
      console.log(
        "No search term, returning all brands:",
        availableBrands.length,
      );
      return availableBrands;
    }
    const filtered = availableBrands.filter(({ brand }) =>
      brand.toLowerCase().includes(brandSearchTerm.value.toLowerCase())
    );
    console.log("Filtered results:", filtered.length, "brands");
    return filtered;
  }, [availableBrands, brandSearchTerm.value]);

  // Process data for scatter plot with filtering
  const scatterData = useMemo(() => {
    let validDevices = devices.filter((device) =>
      device.totalRating >= minRating &&
      device.pricing.average &&
      device.pricing.average >= priceRange[0] &&
      device.pricing.average <= priceRange[1] &&
      !device.pricing.discontinued
    );

    // Filter by selected brands or show top brands only
    if (brandSelectionMode === "manual") {
      if (selectedBrands.length > 0) {
        validDevices = validDevices.filter((device) =>
          selectedBrands.includes(device.brand.sanitized)
        );
      } else {
        // When manual mode is selected but no brands are chosen, show empty chart
        validDevices = [];
      }
    } else if (brandSelectionMode === "top8") {
      validDevices = validDevices.filter((device) =>
        topBrands.includes(device.brand.sanitized)
      );
    }

    // Group by brand for different colors, ensuring each device appears only once
    const brandGroups: { [key: string]: any[] } = {};
    const processedDevices = new Set<string>();

    validDevices.forEach((device) => {
      const deviceKey = `${device.name.normalized}-${device.brand.sanitized}`;

      // Skip if we've already processed this device
      if (processedDevices.has(deviceKey)) {
        return;
      }

      processedDevices.add(deviceKey);
      const brand = device.brand.sanitized;

      if (!brandGroups[brand]) {
        brandGroups[brand] = [];
      }

      brandGroups[brand].push({
        x: device.pricing.average,
        y: device.totalRating,
        device: device.name.normalized,
        deviceSanitized: device.name.sanitized,
        brand: device.brand.normalized,
        price: device.pricing.average,
        rating: device.totalRating,
        image: device.image,
      });
    });

    // Convert to chart datasets
    const datasets = Object.entries(brandGroups).map(([brand, points]) => ({
      label: brand,
      data: points,
      backgroundColor: getBrandColor(brand),
      borderColor: getBrandColor(brand),
      pointRadius: 6,
      pointHoverRadius: 8,
    }));

    return datasets;
  }, [
    devices,
    selectedBrands,
    priceRange,
    minRating,
    brandSelectionMode,
    topBrands,
  ]);

  // Calculate value champions (best performance per dollar)
  const _valueChampions = useMemo(() => {
    let validDevices = devices.filter((device) =>
      device.totalRating >= minRating &&
      device.pricing.average &&
      device.pricing.average >= priceRange[0] &&
      device.pricing.average <= priceRange[1] &&
      !device.pricing.discontinued
    );

    // Apply same brand filtering as scatter plot
    if (brandSelectionMode === "manual") {
      if (selectedBrands.length > 0) {
        validDevices = validDevices.filter((device) =>
          selectedBrands.includes(device.brand.sanitized)
        );
      } else {
        // When manual mode is selected but no brands are chosen, show empty
        validDevices = [];
      }
    } else if (brandSelectionMode === "top8") {
      validDevices = validDevices.filter((device) =>
        topBrands.includes(device.brand.sanitized)
      );
    }

    return validDevices
      .map((device) => ({
        ...device,
        valueScore: device.totalRating / (device.pricing.average! / 100), // Rating per $100
      }))
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 5);
  }, [
    devices,
    selectedBrands,
    priceRange,
    minRating,
    brandSelectionMode,
    topBrands,
  ]);

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        mode: "nearest" as const,
        intersect: false,
        usePointStyle: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        filter: (tooltipItem: any) => {
          // Only show tooltip for the first occurrence of each device
          const deviceName = tooltipItem.raw.device;
          const _currentIndex = tooltipItem.dataIndex;
          const datasetIndex = tooltipItem.datasetIndex;

          // Find if this device appears in any previous datasets
          for (let i = 0; i < datasetIndex; i++) {
            const dataset = tooltipItem.chart.data.datasets[i];
            if (dataset && dataset.data) {
              const foundIndex = dataset.data.findIndex((point: any) =>
                point.device === deviceName
              );
              if (foundIndex !== -1) {
                return false; // Don't show tooltip for this duplicate
              }
            }
          }
          return true; // Show tooltip for first occurrence
        },
        callbacks: {
          title: (context: any) => {
            return `${context[0].raw.device} - Click to view device page`;
          },
          label: (context: any) => {
            const data = context.raw;
            return `Brand: ${data.brand} | Price: $${data.price} | Rating: ${data.rating}/10 | Value: ${
              (data.rating / (data.price / 100)).toFixed(2)
            }/10 per $100`;
          },
        },
      },
    },
    onHover: (event: any, elements: any, chart: any) => {
      const tooltip = document.getElementById("device-image-tooltip");
      const content = document.getElementById("device-image-content");

      if (elements.length > 0 && tooltip && content) {
        const element = elements[0];
        const data =
          chart.data.datasets[element.datasetIndex].data[element.index];

        if (
          data.image &&
          (data.image.webpUrl || data.image.pngUrl || data.image.originalUrl)
        ) {
          const imageUrl = data.image.webpUrl || data.image.pngUrl ||
            data.image.originalUrl;

          content.innerHTML = `
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${data.device}</div>
              <img src="${imageUrl}" alt="${data.device}" style="max-width: 120px; max-height: 80px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" />
            </div>
          `;

          // Position tooltip near mouse - use absolute positioning relative to viewport
          tooltip.style.position = "fixed";
          tooltip.style.left = (event.native.clientX + 20) + "px";
          tooltip.style.top = (event.native.clientY - 10) + "px";
          tooltip.style.display = "block";
        } else {
          tooltip.style.display = "none";
        }
      } else if (tooltip) {
        tooltip.style.display = "none";
      }
    },
    onClick: (_event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const dataIndex = element.index;
        const dataset = chart.data.datasets[datasetIndex];
        const dataPoint = dataset.data[dataIndex];

        if (dataPoint && dataPoint.deviceSanitized) {
          // Navigate to the device page using sanitized name
          globalThis.location.href = `/devices/${dataPoint.deviceSanitized}`;
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        grid: {
          color: "#898989",
        },
      },
      y: {
        title: {
          display: true,
          text: "Performance Rating",
        },
        min: 0,
        max: 10,
        grid: {
          color: "#898989",
        },
      },
    },
  };

  return (
    <div>
      <p style={{ marginTop: "0", marginBottom: "1rem" }}>
        Compare device performance ratings against their average price to
        identify value champions and market positioning
      </p>

      {/* Device Image Tooltip */}
      <div
        id="device-image-tooltip"
        style={{
          position: "fixed",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          display: "none",
          maxWidth: "200px",
          pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div id="device-image-content"></div>
      </div>

      <div class="card">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="radio"
                name="brandSelection"
                value="top8"
                checked={brandSelectionMode === "top8"}
                onChange={(_e) => {
                  setBrandSelectionMode("top8");
                  setSelectedBrands([]);
                }}
              />
              Show top 8 brands only
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="radio"
                name="brandSelection"
                value="manual"
                checked={brandSelectionMode === "manual"}
                onChange={(_e) => {
                  setBrandSelectionMode("manual");
                  setSelectedBrands([]);
                }}
              />
              Select brands manually
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label>Min Rating:</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.currentTarget.value))}
            >
              <option value={0}>All</option>
              <option value={5}>5+</option>
              <option value={6}>6+</option>
              <option value={7}>7+</option>
              <option value={8}>8+</option>
              <option value={9}>9+</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label>Price Range:</label>
            <select
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, parseInt(e.currentTarget.value)])}
            >
              <option value={100}>$0 - $100</option>
              <option value={250}>$0 - $250</option>
              <option value={500}>$0 - $500</option>
              <option value={1000}>$0 - $1000</option>
              <option value={1500}>$0 - $1500</option>
            </select>
          </div>
        </div>

        {brandSelectionMode === "manual" && (
          <div>
            <label>Select Brands to Compare:</label>

            {/* Selected Brands Tags */}
            {selectedBrands.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    class="secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                      border: "1px solid var(--pico-muted-border-color)",
                    }}
                  >
                    {brand}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand),
                        );
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "1rem",
                        color: "var(--pico-muted-color)",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  class="secondary"
                  onClick={() => setSelectedBrands([])}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.875rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Brand Search Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search brands..."
                value={brandSearchTerm.value}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  console.log("Input onChange called with value:", value);
                  brandSearchTerm.value = value;
                  setShowBrandDropdown(true);
                }}
                onFocus={() => {
                  setShowBrandDropdown(true);
                }}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  fontSize: "1rem",
                }}
              />

              {showBrandDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "var(--pico-background-color)",
                    border: "1px solid var(--pico-muted-border-color)",
                    borderTop: "none",
                    borderRadius: "0 0 0.25rem 0.25rem",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding: "0",
                    margin: "0",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {(() => {
                      console.log(
                        "Rendering dropdown with",
                        filteredBrands.length,
                        "brands",
                      );
                      return filteredBrands.length > 0;
                    })()
                    ? (
                      filteredBrands.map(({ brand, count }) => (
                        <div
                          key={brand}
                          onClick={() => {
                            if (!selectedBrands.includes(brand)) {
                              setSelectedBrands([...selectedBrands, brand]);
                            }
                            brandSearchTerm.value = "";
                            setShowBrandDropdown(false);
                          }}
                          class={selectedBrands.includes(brand)
                            ? "secondary"
                            : ""}
                          style={{
                            padding: "0.5rem",
                            cursor: "pointer",
                            borderBottom:
                              "1px solid var(--pico-muted-border-color)",
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedBrands.includes(brand)) {
                              e.currentTarget.style.backgroundColor =
                                "var(--pico-background-color-hover)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedBrands.includes(brand)) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>{brand}</span>
                          <span
                            class="secondary"
                            style={{ marginLeft: "0.5rem" }}
                          >
                            ({count} devices)
                          </span>
                          {selectedBrands.includes(brand) && (
                            <span
                              class="secondary"
                              style={{ marginLeft: "0.5rem" }}
                            >
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      ))
                    )
                    : (
                      <div
                        class="secondary"
                        style={{
                          padding: "0.5rem",
                          fontStyle: "italic",
                        }}
                      >
                        No brands found
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ height: "500px", width: "100%" }}>
        <FreshChart
          type="scatter"
          data={{
            datasets: scatterData,
          }}
          options={options}
        />
      </div>

      <p class="secondary" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong>{" "}
        Only includes devices with valid pricing and ratings. Discontinued
        devices are excluded. Value Score = Rating ÷ (Price ÷ $100)
      </p>
    </div>
  );
}
