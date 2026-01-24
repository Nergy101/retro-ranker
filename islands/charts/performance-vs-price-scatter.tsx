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
    "all" | "top8" | "manual"
  >("all");
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
  // Predefined distinct color palette for better visual separation
  const distinctColors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#F7DC6F", // Yellow (changed from Blue for better contrast)
    "#FFA07A", // Light Salmon
    "#BB8FCE", // Purple
    "#52BE80", // Green
    "#F8B739", // Orange
    "#5DADE2", // Light Blue
    "#EC7063", // Coral
    "#AF7AC5", // Lavender
    "#76D7C4", // Turquoise
    "#F1948A", // Pink
    "#5499C7", // Steel Blue
    "#F5B041", // Amber
    "#58D68D", // Emerald
    "#EB984E", // Burnt Orange
    "#45B7D1", // Blue
    "#98D8C8", // Mint
    "#85C1E2", // Sky Blue
    "#F4D03F", // Gold
  ];

  // Generate stable colors for brands
  const getBrandColor = (brand: string, _brandIndex?: number): string => {
    // If manually selecting brands, use distinct colors from palette
    if (brandSelectionMode === "manual" && selectedBrands.length > 0) {
      const index = selectedBrands.indexOf(brand);
      if (index !== -1) {
        // Use distinct colors from palette, cycling if needed
        return distinctColors[index % distinctColors.length];
      }
    }

    // For other modes or fallback, use hash-based color
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

  // Get available brands and their device counts (for manual selection)
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

  // Get top brands based on filtered devices (respects minRating and priceRange)
  const topBrands = useMemo(() => {
    // Apply the same filters as scatterData to get accurate top brands
    const filteredDevices = devices.filter((device) =>
      device.totalRating >= minRating &&
      device.pricing.average &&
      device.pricing.average >= priceRange[0] &&
      device.pricing.average <= priceRange[1] &&
      !device.pricing.discontinued
    );

    const brandCounts: { [key: string]: number } = {};
    filteredDevices.forEach((device) => {
      const brand = device.brand.sanitized;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    return Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([brand]) => brand);
  }, [devices, minRating, priceRange]);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm.value.trim()) {
      return availableBrands;
    }
    const filtered = availableBrands.filter(({ brand }) =>
      brand.toLowerCase().includes(brandSearchTerm.value.toLowerCase())
    );
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
    } else if (brandSelectionMode === "all") {
      // Show all brands - no brand filtering applied
      // validDevices already contains all devices that pass price/rating filters
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

    // Apply jitter to overlapping points to make them all visible
    const allPoints: any[] = [];
    Object.values(brandGroups).forEach((points) => {
      allPoints.push(...points);
    });

    // Group points by rounded coordinates to detect overlaps
    const overlapGroups = new Map<string, any[]>();
    allPoints.forEach((point) => {
      // Round to detect near-overlaps (within 1% of price range and 0.1 rating)
      const priceRangeSize = priceRange[1] - priceRange[0];
      const roundedX = Math.round(point.x / (priceRangeSize * 0.01)) *
        (priceRangeSize * 0.01);
      const roundedY = Math.round(point.y / 0.1) * 0.1;
      const key = `${roundedX.toFixed(2)}_${roundedY.toFixed(2)}`;

      if (!overlapGroups.has(key)) {
        overlapGroups.set(key, []);
      }
      overlapGroups.get(key)!.push(point);
    });

    // Apply jitter to overlapping points
    overlapGroups.forEach((overlappingPoints) => {
      if (overlappingPoints.length > 1) {
        const priceRangeSize = priceRange[1] - priceRange[0];
        const jitterAmountX = priceRangeSize * 0.015; // 1.5% of price range
        const jitterAmountY = 0.2; // 0.2 rating units

        overlappingPoints.forEach((point, index) => {
          // Store original coordinates for tooltips
          point.originalX = point.x;
          point.originalY = point.y;

          // Distribute points evenly in a circle around the original position
          // Use golden angle for even distribution
          const angle = (index * 137.508) % 360; // Golden angle in degrees
          const angleRad = (angle * Math.PI) / 180;

          // Scale radius based on number of overlapping points
          // More points = larger circle
          const baseRadius = 0.4;
          const radiusScale = Math.min(overlappingPoints.length / 2, 1.5);
          const radius = baseRadius * radiusScale;

          const jitterX = Math.cos(angleRad) * jitterAmountX * radius;
          const jitterY = Math.sin(angleRad) * jitterAmountY * radius;

          // Apply jitter
          point.x = point.x + jitterX;
          point.y = point.y + jitterY;
        });
      }
    });

    // Convert to chart datasets
    // Sort brands by selection order when in manual mode to ensure consistent color assignment
    const sortedBrandEntries =
      brandSelectionMode === "manual" && selectedBrands.length > 0
        ? Object.entries(brandGroups).sort(([brandA], [brandB]) => {
          const indexA = selectedBrands.indexOf(brandA);
          const indexB = selectedBrands.indexOf(brandB);
          // Selected brands first (in selection order), then others
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        })
        : Object.entries(brandGroups);

    const datasets = sortedBrandEntries.map(([brand, points], index) => {
      const brandIndex =
        brandSelectionMode === "manual" && selectedBrands.length > 0
          ? selectedBrands.indexOf(brand)
          : index;
      const color = getBrandColor(brand, brandIndex);
      return {
        label: brand,
        data: points,
        backgroundColor: color + "CC", // Add transparency (CC = ~80% opacity)
        borderColor: color,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBorderWidth: 2,
      };
    });

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
    // When brandSelectionMode === "all", show all brands (no filtering)

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
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: false, // Disable default tooltip
        external: (context: any) => {
          const tooltip = document.getElementById("device-tooltip");
          if (!tooltip) return;

          // Hide tooltip if no active element
          if (!context.tooltip.opacity || context.tooltip.opacity === 0) {
            tooltip.style.display = "none";
            return;
          }

          // Get the data point
          const tooltipItem = context.tooltip.dataPoints[0];
          if (!tooltipItem) {
            tooltip.style.display = "none";
            return;
          }

          const data = tooltipItem.raw;
          const datasetIndex = tooltipItem.datasetIndex;

          // Check if this device appears in any previous datasets (duplicate check)
          let isDuplicate = false;
          const deviceName = data.device;
          for (let i = 0; i < datasetIndex; i++) {
            const dataset = context.chart.data.datasets[i];
            if (dataset && dataset.data) {
              const foundIndex = dataset.data.findIndex((point: any) =>
                point.device === deviceName
              );
              if (foundIndex !== -1) {
                isDuplicate = true;
                break;
              }
            }
          }

          if (isDuplicate) {
            tooltip.style.display = "none";
            return;
          }

          // Use original coordinates if jittered, otherwise use current values
          const displayPrice = data.originalX !== undefined
            ? data.originalX
            : data.price;
          const displayRating = data.originalY !== undefined
            ? data.originalY
            : data.rating;
          const valueScore = (displayRating / (displayPrice / 100)).toFixed(2);

          // Build tooltip content
          let imageHtml = "";
          if (
            data.image &&
            (data.image.webpUrl || data.image.pngUrl || data.image.originalUrl)
          ) {
            const imageUrl = data.image.webpUrl || data.image.pngUrl ||
              data.image.originalUrl;
            imageHtml = `
              <div style="text-align: center; margin-top: 12px;">
                <img src="${imageUrl}" alt="${data.device}" style="max-width: 120px; max-height: 80px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" />
              </div>
            `;
          }

          tooltip.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
              ${data.device} - Click to view device page
            </div>
            <div style="font-size: 12px; line-height: 1.6;">
              Brand: ${data.brand}<br/>
              Price: $${displayPrice.toFixed(2)}<br/>
              Rating: ${displayRating.toFixed(2)}/10<br/>
              Value: ${valueScore}/10 per $100
            </div>
            ${imageHtml}
          `;

          // Position tooltip
          const position = context.chart.canvas.getBoundingClientRect();
          tooltip.style.position = "fixed";
          tooltip.style.left = (position.left + context.tooltip.caretX + 20) +
            "px";
          tooltip.style.top = (position.top + context.tooltip.caretY - 10) +
            "px";
          tooltip.style.display = "block";
        },
      },
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
      <h2>Performance vs Price</h2>
      <p style={{ marginTop: "0", marginBottom: "1rem" }}>
        Use the interactive controls to filter by brand, minimum rating, and
        price range.
        <br />Hover a dot to see the device image and click on any dot to go to
        the device page.
      </p>

      {/* Custom Tooltip */}
      <div
        id="device-tooltip"
        style={{
          position: "fixed",
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          display: "none",
          maxWidth: "250px",
          pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      />

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
                value="all"
                checked={brandSelectionMode === "all"}
                onChange={(_e) => {
                  setBrandSelectionMode("all");
                  setSelectedBrands([]);
                }}
              />
              Show all brands
            </label>
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

      <div class="chart performance-vs-price-chart">
        <p class="secondary" style={{ marginBottom: "1rem" }}>
          Showing <strong>{scatterData.length}</strong>{" "}
          {scatterData.length === 1 ? "brand" : "brands"} with{" "}
          <strong>
            {scatterData.reduce((sum, dataset) => sum + dataset.data.length, 0)}
          </strong>{" "}
          {scatterData.reduce(
              (sum, dataset) => sum + dataset.data.length,
              0,
            ) ===
              1
            ? "device"
            : "devices"}
        </p>
        <div class="performance-vs-price-chart-container">
          <FreshChart
            type="scatter"
            key={`scatter-${brandSelectionMode}-${scatterData.length}`}
            data={{
              datasets: scatterData,
            }}
            options={options}
          />
        </div>
      </div>

      <p class="secondary" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong>{" "}
        Only includes devices with valid pricing and ratings. Discontinued
        devices are excluded. Value Score = Rating ÷ (Price ÷ $100)
      </p>
    </div>
  );
}
