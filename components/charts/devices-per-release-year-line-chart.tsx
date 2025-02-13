import FreshChart from "../../islands/charts/chart.tsx";
import { ChartColors, transparentize } from "$fresh_charts/utils.ts";
import { Device } from "../../data/device.model.ts";

interface LineChartProps {
  devices: Device[];
}

export function DevicesPerReleaseYearLineChart({ devices }: LineChartProps) {
  const getAllYears = (): number[] => {
    const years: number[] = [];
    for (const d of devices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        years.push(actualDate.getFullYear());
      }
    }
    return Array.from(new Set(years)).sort((a, b) => a - b);
  };

  const getLineChartLabels = (): (number | string)[] => {
    return getAllYears();
  };

  const getLineChartData = () => {
    const years = getAllYears();
    const amountOfDevicesPerYear: number[] = Array(years.length).fill(0);

    for (const d of devices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        const year = actualDate.getFullYear();
        const index = years.indexOf(year);
        if (index !== -1) {
          amountOfDevicesPerYear[index]++;
        }
      }
    }

    const dataSets = [{
      label: "Devices released in year",
      data: amountOfDevicesPerYear,
      fill: true,
      borderColor: ChartColors.Blue,
      backgroundColor: transparentize(ChartColors.Blue, 0.9),
      borderWidth: 1,
      tension: 0.4,
      pointRadius: 5,
    }];

    return dataSets;
  };

  return (
    <div>
      <h2>Devices released per year</h2>
      <p>Keep in mind, the current year is not complete yet.</p>
      <FreshChart
        type="line"
        options={{
          scales: {
            y: {
              min: 0,
              ticks: {},
            },
          },
        }}
        data={{
          labels: getLineChartLabels(),
          datasets: getLineChartData() as any,
        }}
      />
    </div>
  );
}
