import { FreshContext, page } from "fresh";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";

import { CustomFreshState } from "@interfaces/state.ts";
import { DevicesPerBrandBarChart } from "@islands/charts/devices-per-brand-bar-chart.tsx";
import { DevicesPerRatingBarChart } from "@islands/charts/devices-per-ranking-bar-chart.tsx";
import { DevicesPerReleaseYearLineChart } from "@islands/charts/devices-per-release-year-line-chart.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  async GET(ctx: FreshContext) {
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

export default async function ChartsIndex(ctx: FreshContext) {
  const devices = (ctx.state as CustomFreshState).data.devices;
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  return (
    <div class="charts-page">
      <hgroup style={{ textAlign: "center" }}>
        <h1>{TranslationPipe(translations, "charts.title")}</h1>
        <p>
          {TranslationPipe(translations, "charts.description")}{" "}
          <span style={{ color: "var(--pico-primary)" }}>
            {devices.length}
          </span>{" "}
          {TranslationPipe(translations, "charts.devices")}
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
