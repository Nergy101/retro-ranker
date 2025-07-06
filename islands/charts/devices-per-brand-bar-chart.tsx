import { useState } from "preact/hooks";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

interface BarChartProps {
  devices: Device[];
  translations?: Record<string, string>;
}

export function DevicesPerBrandBarChart(
  { devices, translations = {} }: BarChartProps,
) {
  const [minAmountOfDevices, setMinAmountOfDevices] = useState(10);

  // Get unique brands from the devices array
  const getAllBrands = () => {
    return Array.from(new Set(devices.map((d) => d.brand.raw)))
      .filter((brand) =>
        brand !== undefined && brand !== null && brand !== "" &&
        brand !== "Unknown"
      );
  };

  const getSortedData = () => {
    let data: { brand: string; amountOfDevices: number }[] = [];

    for (const brand of getAllBrands()) {
      const number = devices.filter((d) => d.brand.raw === brand).length;
      data.push({ brand: brand, amountOfDevices: number });
    }

    data = data
      .filter((d) => d.amountOfDevices >= minAmountOfDevices)
      .sort((a, b) => a.amountOfDevices - b.amountOfDevices);

    return data;
  };

  // Generate a color based on the brand name.
  // This produces a stable color by converting a string hash to an HSL value.
  const getColorsForBrand = (brand: string): [string, string] => {
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = hash % 360;
    if (hue < 0) {
      hue += 360;
    }
    // The saturation and lightness can be adjusted as needed.
    return ["hsl(" + hue + ", 70%, 50%)", "hsl(" + hue + ", 70%, 50%, 0.5)"];
  };

  // Get colors for all unique brands
  const getColorsForAllBrands = () => {
    return getAllBrands().map((brand) => getColorsForBrand(brand));
  };

  const getBarChartData = () => {
    const data = getSortedData();

    const colorsForAllBrands = getColorsForAllBrands();
    return [{
      label: TranslationPipe(translations, "charts.devicesPerBrand"),
      backgroundColor: colorsForAllBrands.map((c) => c[1]),
      borderColor: colorsForAllBrands.map((c) => c[0]),
      borderWidth: 1,
      hoverBorderWidth: 3,
      data: data.map((d) => d.amountOfDevices),
      tooltip: {
        callbacks: {
          // deno-lint-ignore no-explicit-any
          label: (context: any) => {
            return `${context.label}: ${context.raw} ${
              TranslationPipe(translations, "charts.devicesPerBrandTooltip")
            }`;
          },
        },
      },
    }];
  };

  const getBarChartLabels = () => {
    const data = getSortedData();
    return data.map((d) => d.brand);
  };

  const barChartData = getBarChartData();
  const maxBarValue = Math.max(
    ...getSortedData().map((d) => d.amountOfDevices),
  );
  const maxBarValueForChart = Math.ceil(maxBarValue / 5) * 5;

  const handleMinAmountOfDevicesChange = (e: Event) => {
    const value = (e.target as HTMLInputElement)?.value;
    setMinAmountOfDevices(parseInt(value ?? "5"));
  };

  return (
    <div>
      <h2>{TranslationPipe(translations, "charts.devicesPerBrand")}</h2>
      <p>
        {TranslationPipe(translations, "charts.minDevices")}{" "}
        {minAmountOfDevices} {TranslationPipe(translations, "charts.devices")}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}>
        <span>0</span>
        <input
          aria-label={TranslationPipe(translations, "charts.minDevices")}
          name="minAmountOfDevices"
          type="range"
          min="1"
          max={maxBarValue}
          step="1"
          list="markers"
          value={minAmountOfDevices}
          onInput={handleMinAmountOfDevicesChange}
        />
        <span>{maxBarValue}</span>
      </div>

      <FreshChart
        type="bar"
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              grid: {
                color: "#898989",
              },
              min: 0,
              max: maxBarValueForChart,
              ticks: {
                stepSize: 5,
              },
            },
          },
        }}
        data={{
          labels: getBarChartLabels(),
          // deno-lint-ignore no-explicit-any
          datasets: barChartData as any,
        }}
      />
    </div>
  );
}
