import { Device } from "../../data/device.model.ts";
import { FreshChart } from "./FreshChart.tsx";

interface BarChartProps {
  devices: Device[];
}

export function DevicesPerRatingBarChart({ devices }: BarChartProps) {
  const possibleColors = [
    ["#FF5733", "#FF573350"], // vivid red-orange
    ["#33FF57", "#33FF5750"], // bright lime green
    ["#3357FF", "#3357FF50"], // strong royal blue
    ["#FF33A1", "#FF33A150"], // hot pink
    ["#33FFF3", "#33FFF350"], // clear cyan
    ["#F3FF33", "#F3FF3350"], // vibrant yellow
    ["#8C33FF", "#8C33FF50"], // electric purple
    ["#33FF8C", "#33FF8C50"], // fresh mint
    ["#e48500", "#e4850050"], // lively orange
    ["#FF3333", "#FF333350"], // bold red
  ];

  // Get unique brands and assign them colors
  const uniqueBrands = Array.from(new Set(devices.map(d => d.brand.sanitized)))
    .filter(brand => brand !== undefined && brand !== null && brand !== "");

  const brandColors = uniqueBrands.reduce((acc, brand, index) => {
    const colorIndex = index % possibleColors.length;
    acc[brand] = possibleColors[colorIndex];
    return acc;
  }, {} as Record<string, string[]>);

  const getBarChartData = () => {
    // Initialize data structure for each rating range
    const ratingRanges = Array.from({ length: 10 }, (_, i) => ({
      min: i,
      max: i + 1,
      brands: {} as Record<string, number>
    }));

    // Count devices for each brand within each rating range
    devices.forEach(device => {
      const ratingIndex = Math.floor(device.totalRating);
      if (ratingIndex >= 0 && ratingIndex < 10) {
        const brandName = device.brand.sanitized;
        if (!ratingRanges[ratingIndex].brands[brandName]) {
          ratingRanges[ratingIndex].brands[brandName] = 0;
        }
        ratingRanges[ratingIndex].brands[brandName]++;
      }
    });

    // Calculate total devices for each brand
    const brandTotals = uniqueBrands.reduce((acc, brand) => {
      acc[brand] = ratingRanges.reduce((sum, range) => sum + (range.brands[brand] || 0), 0);
      return acc;
    }, {} as Record<string, number>);

    // Sort brands by their total number of devices in descending order
    const sortedBrands = [...uniqueBrands].sort((a, b) => brandTotals[b] - brandTotals[a]);

    // Convert to Chart.js dataset format with sorted brands
    return sortedBrands.map(brand => ({
      label: brand,
      data: ratingRanges.map(range => range.brands[brand] || 0),
      backgroundColor: brandColors[brand][1],
      borderColor: brandColors[brand][0],
      borderWidth: 1,
      hoverBorderWidth: 3,
    }));
  };

  const getBarChartLabels = () => {
    return Array.from({ length: 10 }, (_, i) => `Rating: ${i} - ${i + 1}`);
  };

  const barChartData = getBarChartData();
  const maxBarValue = Math.round(
    Math.max(
      ...barChartData[0].data.map((_, i) => 
        barChartData.reduce((sum, dataset) => sum + dataset.data[i], 0)
      )
    ) / 10
  ) * 10;

  return (
    <div>
      <h2>Devices per ranking</h2>
      <p>Based on the total ranking of the device: 0-10</p>
      <p>The ranking mostly shows the emulation performance of the device, 
        <br />
        with some other factors mixed in.</p>
      <FreshChart
        type="bar"
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'nearest' as const,
              intersect: true,
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.raw} devices`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              grid: {
                color: "#898989",
              },
              min: 0,
              max: maxBarValue,
              ticks: {},
            },
          },
        }}
        data={{
          labels: getBarChartLabels(),
          datasets: barChartData,
        }}
      />
    </div>
  );
}
