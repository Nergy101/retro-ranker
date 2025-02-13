import { Device } from "../../data/device.model.ts";
import FreshChart from "../../islands/charts/chart.tsx";

interface BarChartProps {
  devices: Device[];
}

export function DevicesPerBrandBarChart({ devices }: BarChartProps) {
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
      .filter((d) => d.amountOfDevices >= 5)
      .sort((a, b) => b.amountOfDevices - a.amountOfDevices);

    return data;
  };

  // Generate a color based on the brand name.
  // This produces a stable color by converting a string hash to an HSL value.
  const getColorForBrand = (brand: string): string => {
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = hash % 360;
    if (hue < 0) {
      hue += 360;
    }
    // The saturation and lightness can be adjusted as needed.
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Get colors for all unique brands
  const getColorsForAllBrands = () => {
    return getAllBrands().map((brand) => getColorForBrand(brand));
  };

  const getBarChartData = () => {
    const data = getSortedData();

    const colorsForAllBrands = getColorsForAllBrands();
    return [{
      label: "Devices per Brand",
      backgroundColor: colorsForAllBrands,
      borderColor: colorsForAllBrands,
      borderWidth: 1,
      data: data.map((d) => d.amountOfDevices),
      tooltip: {
        callbacks: {
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
  // const maxBarValue = Math.max(...getSortedData().map((d) => d.amountOfDevices));

  return (
    <div>
      <h2>Devices created per Brand</h2>
      <p>Minimum of 5 devices</p>
      <FreshChart
        type="bar"
        options={{
          scales: {
            y: {
              min: 0,
              // max: maxBarValue,
              ticks: {},
            },
          },
        }}
        data={{
          labels: getBarChartLabels(),
          datasets: barChartData as any,
        }}
      />
    </div>
  );
}
