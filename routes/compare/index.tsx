import { FreshContext } from "fresh";

import { PiChartLine, PiInfo } from "@preact-icons/pi";
import { page } from "fresh";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { Ranking } from "@data/frontend/models/ranking.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import { RatingsService } from "@data/frontend/services/devices/ratings.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { DevicesRadarChart } from "@islands/charts/devices-radar-chart.tsx";
import { DeviceComparisonForm } from "@islands/forms/device-comparison-form.tsx";
import { DeviceComparisonResult } from "@components/comparisons/device-comparison-result.tsx";
import { DeviceComparisonText } from "@components/comparisons/device-comparison-text.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  async GET(ctx: FreshContext) {
    const deviceService = await DeviceService.getInstance();
    const ratingsService = RatingsService.getInstance();

    const searchParams = new URLSearchParams(ctx.url.search);
    const devices = searchParams.get("devices")?.split(",") || [];

    const devicesToCompare =
      (await Promise.all(devices.map((d) => deviceService.getDeviceByName(d))))
        .filter((device) => device !== null);

    const deviceNames = devicesToCompare.map((device) => device.name.raw);
    const allDevices = (await deviceService.getAllDevices())
      .sort((a, b) => a.name.raw.localeCompare(b.name.raw));

    const similarDevices = (await Promise.all(
      devicesToCompare.map((device) =>
        deviceService.getSimilarDevices(device.name.sanitized, 8)
      ),
    )).flat();

    const ranking = ratingsService.createRanking(devicesToCompare);

    (ctx.state as CustomFreshState).data = {
      devicesToCompare,
      deviceNames,
      allDevices,
      similarDevices,
      ranking,
    };

    let seoTitle = "Retro Ranker - Compare";
    let seoDescription =
      "Compare retro handhelds side-by-side with detailed specs.";

    if (devicesToCompare.length === 2) {
      const [device1, device2] = devicesToCompare;
      seoTitle =
        `${device1.brand.raw} ${device1.name.raw} vs ${device2.brand.raw} ${device2.name.raw} - Retro Handheld Comparison`;
      seoDescription =
        `Compare ${device1.brand.raw} ${device1.name.raw} vs ${device2.brand.raw} ${device2.name.raw}.`;
    } else if (devicesToCompare.length > 0) {
      seoTitle = `Compare ${deviceNames.join(" vs ")} - Retro Gaming Handhelds`;
      seoDescription = `Compare ${
        deviceNames.join(", ")
      } retro gaming handhelds.`;
    }

    (ctx.state as CustomFreshState).seo = {
      title: seoTitle,
      description: seoDescription,
      keywords:
        "retro handhelds, compare, side-by-side, specs, emulation, performance, dimensions, connectivity, audio, controls, misc",
    };

    return page(ctx);
  },
};

export default function Compare(ctx: FreshContext) {
  const data = (ctx.state as CustomFreshState).data as {
    devicesToCompare: Device[];
    deviceNames: string[];
    allDevices: Device[];
    similarDevices: Device[];
    ranking: Ranking;
  };
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const devicesToCompare = data.devicesToCompare as Device[];
  const deviceNames = data.deviceNames;
  const allDevices = data.allDevices;
  const similarDevices = data.similarDevices;
  const ranking = data.ranking;

  return (
    <div class="compare-page">
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>{TranslationPipe(translations, "compare.title")}</h1>
          {deviceNames.length > 0
            ? (
              <p>
                {TranslationPipe(translations, "compare.comparingDevices")}{" "}
                <br />
                {deviceNames.join(", ")}
              </p>
            )
            : (
              <p>
                {TranslationPipe(translations, "compare.compareBetween")}{" "}
                <span style={{ color: "var(--pico-primary)" }}>
                  {allDevices.length}
                </span>{" "}
                {TranslationPipe(translations, "compare.devices")}
              </p>
            )}
        </hgroup>
      </header>

      <div>
        <DeviceComparisonForm
          allDevices={allDevices}
          devicesToCompare={devicesToCompare}
          similarDevices={similarDevices}
          translations={translations}
        />
      </div>

      {devicesToCompare.length === 2 && (
        <div class="comparison-text-container">
          <DeviceComparisonText devices={devicesToCompare} />
        </div>
      )}

      {devicesToCompare.length > 1 && (
        <div>
          <details>
            <summary class="flex">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <PiChartLine />{" "}
                {TranslationPipe(translations, "compare.showRankingChart")}
              </div>
            </summary>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                class="overflow-auto"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <DevicesRadarChart
                  devices={devicesToCompare}
                  showTitle={false}
                  ranking={ranking}
                  translations={translations}
                />
              </div>
            </div>
          </details>
        </div>
      )}
      <details>
        <summary class="flex">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PiInfo />{" "}
            {TranslationPipe(translations, "compare.howRankingWorks")}
          </div>
        </summary>
        <div>
          <p>
            {TranslationPipe(translations, "compare.rankingDescription")}
            <br />
            {TranslationPipe(translations, "compare.rankingExplanation")}
            <br />
            {TranslationPipe(translations, "compare.categoryWeights")}:
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}
            >
              <ul>
                <li>
                  {TranslationPipe(translations, "compare.performance")} (30%)
                </li>
                <li>
                  {TranslationPipe(translations, "compare.monitor")} (10%)
                </li>
                <li>
                  {TranslationPipe(translations, "compare.dimensions")} (10%)
                </li>
              </ul>
              <ul>
                <li>
                  {TranslationPipe(translations, "compare.connectivity")} (20%)
                </li>
                <li>{TranslationPipe(translations, "compare.audio")} (10%)</li>
                <li>
                  {TranslationPipe(translations, "compare.controls")} (10%)
                </li>
              </ul>
              <ul>
                <li>{TranslationPipe(translations, "compare.misc")} (10%)</li>
              </ul>
            </div>
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "fit-content",
                backgroundColor: "#3952A2",
                color: "white",
                borderRadius: "0.25rem",
                padding: "0.25rem",
              }}
            >
              {TranslationPipe(translations, "compare.blueMeansEqual")}
            </span>
            <br />
            <span
              style={{
                width: "fit-content",
                backgroundColor: "#16833E",
                color: "white",
                borderRadius: "0.25rem",
                padding: "0.25rem",
              }}
            >
              {TranslationPipe(translations, "compare.greenMeansBetter")}
            </span>
            <br />
            <span
              style={{
                width: "fit-content",
                backgroundColor: "#AB0D0D",
                color: "white",
                borderRadius: "0.25rem",
                padding: "0.25rem",
              }}
            >
              {TranslationPipe(translations, "compare.redMeansWorse")}
            </span>
          </div>
        </div>
      </details>

      <div class="compare-container">
        {devicesToCompare.map((device) => (
          <DeviceComparisonResult device={device} ranking={ranking} />
        ))}
      </div>
    </div>
  );
}
