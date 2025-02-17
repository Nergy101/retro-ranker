import { Head } from "$fresh/runtime.ts";
import { DeviceService } from "../../services/devices/device.service.ts";

import { DevicesPerBrandBarChart } from "../../islands/charts/DevicesPerBrandBarChart.tsx";
import { DevicesPerRatingBarChart } from "../../islands/charts/DevicesPerRankingBarChart.tsx";
import { DevicesPerReleaseYearLineChart } from "../../islands/charts/DevicesPerReleaseYearLineChart.tsx";

export default function ChartsIndex() {
  const deviceService = DeviceService.getInstance();
  const devices = deviceService.getAllDevices();

  return (
    <div class="charts-page">
      <Head>
        <title>Retro Ranker - Explore Charts</title>
        <meta
          name="description"
          content="Explore charts for all devices in the Retro Ranker database."
        />
      </Head>
      <hgroup style={{ textAlign: "center" }}>
        <h1>Explore Charts</h1>
        <p>
          Explore charts for{" "}
          <span style={{ color: "var(--pico-primary)" }}>
            {devices.length}
          </span>{" "}
          devices
        </p>
      </hgroup>

      <div class="chart-wrapper">
        <DevicesPerReleaseYearLineChart devices={devices} />
      </div>
      <hr />
      <div class="chart-wrapper">
        <DevicesPerBrandBarChart devices={devices} />
      </div>
      <hr />
      <div class="chart-wrapper">
        <DevicesPerRatingBarChart devices={devices} />
      </div>
    </div>
  );
}
