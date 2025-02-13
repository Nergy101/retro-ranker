import { Device } from "../../data/device.model.ts";
import FreshChart from "./chart.tsx";

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

  const usedColors: string[][] = [];
  const getNextUnusedColor = () => {
    const color = possibleColors[usedColors.length];
    if (usedColors.some((c) => c[0] === color[0])) {
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
      label: "Devices per ranking (0-10)",
      backgroundColor: tenColors.map((c) => c[1]),
      borderColor: tenColors.map((c) => c[0]),
      borderWidth: 3,
      data,
    }];
  };

  const getBarChartLabels = () => {
    return Array.from({ length: 10 }, (_, i) => `Ranking: ${i} - ${i + 1}`);
  };

  const barChartData = getBarChartData();
  // round to nearest 10
  const maxBarValue = Math.round(Math.max(...barChartData[0].data) / 10) * 10;

  return (
    <div>
      <h2>Devices per ranking</h2>
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
          // deno-lint-ignore no-explicit-any
          datasets: barChartData as any,
        }}
      />
    </div>
  );
}
