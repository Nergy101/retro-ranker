import { Context, page } from "fresh";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";

import { CustomFreshState } from "../../interfaces/state.ts";
import { DevicesPerBrandBarChart } from "../../islands/charts/devices-per-brand-bar-chart.tsx";
import { DevicesPerReleaseYearLineChart } from "../../islands/charts/devices-per-release-year-line-chart.tsx";
import { PerformanceVsPriceScatterPlot } from "../../islands/charts/performance-vs-price-scatter.tsx";
import { PriceRangeDistribution } from "../../islands/charts/price-range-distribution.tsx";
import { PriceVsReleaseYear } from "../../islands/charts/price-vs-release-year.tsx";
import { OperatingSystemDistribution } from "../../islands/charts/os-distribution.tsx";
import { YearOverYearImprovement } from "../../islands/charts/year-over-year-improvement.tsx";
import { State } from "../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Charts",
      description:
        "Explore interactive charts and data visualizations of retro gaming handhelds. View statistics on device brands, performance ratings, release trends, and market analysis of portable emulation systems.",
      keywords:
        "retro gaming charts, handheld device statistics, emulation device analytics, retro console data, gaming hardware trends, retro gaming market analysis, handheld comparison graphs",
    };
    const deviceService = await DeviceService.getInstance();
    const devices = await deviceService.getAllDevices();

    (ctx.state as CustomFreshState).data.devices = devices;

    return page(ctx);
  },
};

export default async function ChartsIndex(ctx: Context<State>) {
  const devices = (ctx.state as CustomFreshState).data.devices;

  return (
    <div class="charts-page">
      <hgroup style={{ textAlign: "center" }}>
        <h1>Charts & Analytics</h1>
        <p>
          Explore interactive charts and data visualizations of retro gaming
          handhelds. View statistics on{" "}
          <span style={{ color: "var(--pico-primary)" }}>
            {devices.length}
          </span>{" "}
          devices
        </p>
      </hgroup>
      <div class="chart-wrapper">
        <DevicesPerReleaseYearLineChart
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <DevicesPerBrandBarChart
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <PerformanceVsPriceScatterPlot
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <PriceRangeDistribution
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <PriceVsReleaseYear
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <OperatingSystemDistribution
          devices={devices}
        />
      </div>
      <hr />
      <div class="chart-wrapper">
        <YearOverYearImprovement
          devices={devices}
        />
      </div>
    </div>
  );
}
