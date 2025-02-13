import { Head } from "$fresh/runtime.ts";
import { DeviceService } from "../../services/devices/device.service.ts";

import { DevicesPerBrandBarChart } from "../../islands/charts/devices-per-brand-bar-chart.tsx";
import { DevicesPerRatingBarChart } from "../../islands/charts/devices-per-rating-bar-chart.tsx";
import { DevicesPerReleaseYearLineChart } from "../../islands/charts/devices-per-release-year-line-chart.tsx";

export default function ChartsIndex() {
  const deviceService = DeviceService.getInstance();
  const devices = deviceService.getAllDevices();

  return (
    <>
      <Head>
        <title>Explore Charts</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Explore Charts</h1>

      <div class="chart-wrapper">
        <DevicesPerReleaseYearLineChart devices={devices} />
      </div>
      <div class="chart-wrapper">
        <DevicesPerRatingBarChart devices={devices} />
      </div>
      <div class="chart-wrapper">
        <DevicesPerBrandBarChart devices={devices} />
      </div>
    </>
  );
}
