import { Device } from "../../data/device.model.ts";
import FreshChart from "../../islands/charts/chart.tsx";

interface BarChartProps {
  devices: Device[];
}

export function DevicesPerRatingBarChart({ devices }: BarChartProps) {
  const possibleColors = [
    "#FF5733", // vivid red-orange
    "#33FF57", // bright lime green
    "#3357FF", // strong royal blue
    "#FF33A1", // hot pink
    "#33FFF3", // clear cyan
    "#F3FF33", // vibrant yellow
    "#8C33FF", // electric purple
    "#FF8C33", // lively orange
    "#33FF8C", // fresh mint
    "#FF3333", // bold red
  ];

  const usedColors: string[] = [];
  const getNextUnusedColor = () => {
    const color = possibleColors[usedColors.length];
    if (usedColors.includes(color)) {
      return getNextUnusedColor();
    }
    usedColors.push(color);
    return color;
  };

  const getBarChartData = () => {
    const tenColors = [
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
      getNextUnusedColor(),
    ];

    const data = [];
    for (let i = 1; i <= 10; i++) {
      const number = devices.filter((d) =>
        d.totalRating >= i - 1 && d.totalRating < i
      ).length;
      data.push(number);
    }

    return [{
      label: "Devices per Ranking (0-10)",
      backgroundColor: tenColors,
      borderColor: tenColors,
      borderWidth: 1,
      data,
    }];
  };

  const getBarChartLabels = () => {
    return Array.from({ length: 10 }, (_, i) => `Ranking: ${i} - ${i + 1}`);
  };

  const barChartData = getBarChartData();
  const maxBarValue = Math.max(...barChartData[0].data);

  return (
    <div>
      <h2>Devices per Ranking</h2>
      <p>Based on the total ranking of the device: 0-10</p>
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
          datasets: barChartData as any,
        }}
      />
    </div>
  );
}
