import { Device } from "../../data/device.model.ts";
import { useSignal } from "@preact/signals";
import { FreshChart } from "./FreshChart.tsx";

interface LineChartProps {
  devices: Device[];
}

export function DevicesPerReleaseYearLineChart({ devices }: LineChartProps) {
  // Compute the full range of years from the devices
  const fullYears = Array.from(
    new Set(
      devices.reduce((acc, d) => {
        if (d.released?.mentionedDate) {
          acc.push(new Date(d.released.mentionedDate).getFullYear());
        }
        return acc;
      }, [] as number[]),
    ),
  ).sort((a, b) => a - b);

  // Use the first and last available years as the slider boundaries
  const initialMin = fullYears[0] ?? new Date().getFullYear();
  const initialMax = fullYears[fullYears.length - 1] ??
    new Date().getFullYear();

  // Signals to store the current filter values for minimum and maximum year
  const selectedMinYear = useSignal(initialMin);
  const selectedMaxYear = useSignal(initialMax);

  // Filter the devices to only include those within the selected year range.
  const filteredDevices = devices.filter((d) => {
    if (d.released?.mentionedDate) {
      const year = new Date(d.released.mentionedDate).getFullYear();
      return year >= selectedMinYear.value && year <= selectedMaxYear.value;
    }
    return false;
  });

  // Compute the unique years from the filtered devices.
  const getAllYears = (): number[] => {
    const years: number[] = [];
    for (const d of filteredDevices) {
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

    for (const d of filteredDevices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        const year = actualDate.getFullYear();
        const index = years.indexOf(year);
        if (index !== -1) {
          amountOfDevicesPerYear[index]++;
        }
      }
    }

    return [{
      label: "Devices released for given year",
      data: amountOfDevicesPerYear,
      fill: true,
      borderColor: "#e48500",
      backgroundColor: "#e4850050",
      pointBackgroundColor: "#e48500",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 5,
    }];
  };

  return (
    <div>
      <h2>Devices released per year</h2>
      <p>Keep in mind, the current year is not complete yet.</p>
      <div>
        <div>
          Min Year: {selectedMinYear.value}
          <input
            aria-label="Minimum year"
            type="range"
            min={initialMin}
            max={selectedMaxYear.value}
            value={selectedMinYear.value}
            onInput={(e: Event) => {
              const value = parseInt((e.target as HTMLInputElement).value);
              selectedMinYear.value = value;
            }}
          />
        </div>
        <div>
          Max Year: {selectedMaxYear.value}
          <input
            aria-label="Maximum year"
            type="range"
            min={selectedMinYear.value}
            max={initialMax}
            value={selectedMaxYear.value}
            onInput={(e: Event) => {
              const value = parseInt((e.target as HTMLInputElement).value);
              selectedMaxYear.value = value;
            }}
          />
        </div>
      </div>
      <FreshChart
        type="line"
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
              ticks: {},
            },
          },
        }}
        data={{
          labels: getLineChartLabels(),
          // deno-lint-ignore no-explicit-any
          datasets: getLineChartData() as any,
        }}
      />
    </div>
  );
}
