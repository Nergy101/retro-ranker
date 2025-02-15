import { Device } from "../../data/device.model.ts";
import { FreshChart } from "./FreshChart.tsx";
import { useSignal } from "@preact/signals";

interface BarChartProps {
  devices: Device[];
}

export function DevicesPerBrandBarChart({ devices }: BarChartProps) {
  const minAmountOfDevices = useSignal(10);

  // Get unique brands from the devices array
  const getAllBrands = () => {
    return Array.from(new Set(devices.map((d) => d.brand)))
      .filter((brand) => brand !== undefined && brand !== null && brand !== "");
  };

  const getSortedData = () => {
    let data: { brand: string; amountOfDevices: number }[] = [];

    for (const brand of getAllBrands()) {
      const number = devices.filter((d) => d.brand === brand).length;
      data.push({ brand, amountOfDevices: number });
    }

    data = data
      .filter((d) => d.amountOfDevices >= minAmountOfDevices.value)
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
      label: "Devices per Brand",
      backgroundColor: colorsForAllBrands.map((c) => c[1]),
      borderColor: colorsForAllBrands.map((c) => c[0]),
      borderWidth: 3,
      data: data.map((d) => d.amountOfDevices),
      tooltip: {
        callbacks: {
          // deno-lint-ignore no-explicit-any
          label: (context: any) => {
            return `${context.label}: ${context.raw} devices`;
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

  const setMinAmountOfDevices = (e: Event) => {
    const value = (e.target as HTMLInputElement)?.value;
    minAmountOfDevices.value = parseInt(value ?? "5");
  };

  return (
    <div>
      <h2>Devices released per brand</h2>
      <p>Minimum of {minAmountOfDevices.value} devices</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}>
        <span>0</span>
        <input
          aria-label="Minimum of devices"
          name="minAmountOfDevices"
          type="range"
          min="1"
          max={maxBarValue}
          step="1"
          list="markers"
          value={minAmountOfDevices.value}
          onInput={setMinAmountOfDevices}
        />
        <span>{maxBarValue}</span>
      </div>

      <FreshChart
        type="bar"
        options={{
          scales: {
            y: {
              min: 0,
              max: maxBarValue,
              ticks: {},
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
