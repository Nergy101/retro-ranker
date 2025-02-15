import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Device } from "../../data/device.model.ts";
import { RatingsService } from "../../services/devices/ratings.service.ts";
import { FreshChart } from "./FreshChart.tsx";
import { Ranking } from "../../data/models/ranking.model.ts";

interface RadarChartProps {
  devices: Device[];
  showTitle?: boolean;
  ranking?: Ranking;
}

export function DevicesRadarChart(
  { devices, showTitle = true, ranking }: RadarChartProps,
) {
  // Create an instance of the ratings service.
  const ratingsService = RatingsService.getInstance();
  const viewportWidth = useSignal(globalThis.innerWidth);
  const chartSize = useSignal({ width: "350px", height: "350px" });

  useEffect(() => {
    const handleResize = () => {
      viewportWidth.value = globalThis.innerWidth;
      setChartSize();
    };

    // Add event listener
    globalThis.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  }, []);

  const setChartSize = (): void => {
    if (viewportWidth.value <= 425) {
      chartSize.value = { width: "350px", height: "350px" };
    } else if (viewportWidth.value <= 768) {
      chartSize.value = { width: "500px", height: "500px" };
    } else {
      chartSize.value = { width: "700px", height: "700px" };
    }
  };

  // Define the axes for the radar chart.
  const labels = [
    "Performance",
    "Monitor",
    "Dimensions",
    "Connectivity",
    "Audio",
    "Controls",
    "Miscellaneous",
  ];

  // For each device, compute the scores and generate a distinct color.
  const datasets = devices.map((device, index) => {
    const performanceScore = ratingsService.calculatePerformanceScore(device);
    const monitorScore = ratingsService.calculateMonitorScore(device);
    const dimensionsScore = ratingsService.calculateDimensionScore(device);
    const connectivityScore = ratingsService.calculateConnectivityScore(device);
    const audioScore = ratingsService.calculateAudioScore(device);
    const controlsScore = ratingsService.calculateControlsScore(device);
    const miscScore = ratingsService.calculateMiscScore(device);

    const data = [
      performanceScore,
      monitorScore,
      dimensionsScore,
      connectivityScore,
      audioScore,
      controlsScore,
      miscScore,
    ];

    // Generate a distinct color for the device.
    const hue = (index * 137.5) % 360;
    let borderColor = `hsl(${hue}, 70%, 50%)`;
    let backgroundColor = `hsla(${hue}, 70%, 50%, 0.3)`;

    // If a ranking is provided, use the color of the best or worst device.

    if (ranking) {
      if (ranking?.all[0] !== "equal") {
        borderColor = ranking?.all[0] === device.name.sanitized
          ? "#16833e"
          : "#ab0d0d";
        backgroundColor = ranking?.all[0] === device.name.sanitized
          ? "#16833e30"
          : "#ab0d0d30";
      }
    }

    return {
      label: device.name.raw, // using the device's raw name for display
      data,
      borderColor,
      backgroundColor,
      pointBackgroundColor: borderColor,
      borderWidth: 2,
    };
  });

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          display: false,
        },
        grid: {
          color: "#898989",
        },
        angleLines: {
          color: "#898989",
        },
      },
    },
    elements: {
      line: {
        tension: 0.2, // Optionally smooth the lines
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: chartSize.value.width,
        height: chartSize.value.height,
      }}
    >
      {showTitle && (
        <h2 style={{ textAlign: "center" }}>
          Device Scoring Radar Chart
        </h2>
      )}
      <FreshChart
        type="radar"
        data={{
          labels,
          datasets,
        }}
        options={options}
      />
    </div>
  );
}
