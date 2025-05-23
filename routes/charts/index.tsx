import SEO from "../../components/SEO.tsx";
import { PageProps } from "$fresh/server.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";

import { DevicesPerBrandBarChart } from "../../islands/charts/devices-per-brand-bar-chart.tsx";
import { DevicesPerRatingBarChart } from "../../islands/charts/devices-per-ranking-bar-chart.tsx";
import { DevicesPerReleaseYearLineChart } from "../../islands/charts/devices-per-release-year-line-chart.tsx";

export default async function ChartsIndex({ url }: PageProps) {
  const deviceService = await DeviceService.getInstance();
  const devices = await deviceService.getAllDevices();

  return (
    <div class="charts-page">
      <SEO
        title="Retro Gaming Handheld Analytics & Charts"
        description="Explore interactive charts and data visualizations of retro gaming handhelds. View statistics on device brands, performance ratings, release trends, and market analysis of portable emulation systems."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro gaming charts, handheld device statistics, emulation device analytics, retro console data, gaming hardware trends, retro gaming market analysis, handheld comparison graphs"
      />
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
