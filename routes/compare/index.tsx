import { FreshContext, PageProps } from "$fresh/server.ts";
import { PiChartLine, PiInfo } from "@preact-icons/pi";
import { DeviceComparisonResult } from "../../components/comparisons/DeviceComparisonResult.tsx";
import { DeviceComparisonText } from "../../components/comparisons/DeviceComparisonText.tsx";
import SEO from "../../components/SEO.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { RatingsService } from "../../data/frontend/services/devices/ratings.service.ts";
import { DevicesRadarChart } from "../../islands/charts/devices-radar-chart.tsx";
import { DeviceComparisonForm } from "../../islands/forms/DeviceComparisonForm.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";

export const handler = {
  async GET(_: Request, ctx: FreshContext) {
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

    return ctx.render({
      devicesToCompare,
      deviceNames,
      allDevices,
      similarDevices,
      ranking,
    });
  },
};
export default function Compare({ url, data }: PageProps) {
  // Generate dynamic SEO content based on devices being compared

  const devicesToCompare = data.devicesToCompare as Device[];
  const deviceNames = data.deviceNames;
  const allDevices = data.allDevices;
  const similarDevices = data.similarDevices;
  const ranking = data.ranking;

  let seoTitle = "Compare Retro Gaming Handhelds";
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

  return (
    <div class="compare-page">
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={`https://retroranker.site${url.pathname}${url.search}`}
        keywords={`${
          deviceNames.join(", ")
        }, compare retro handhelds, side-by-side comparison, retro gaming specs, emulation device comparison, handheld performance comparison, retro console features, gaming device specs, retro gaming hardware`}
      />
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Compare Devices</h1>
          {deviceNames.length > 0
            ? (
              <p>
                Comparing the following devices: <br />
                {deviceNames.join(", ")}
              </p>
            )
            : (
              <p>
                Compare between{" "}
                <span style={{ color: "var(--pico-primary)" }}>
                  {allDevices.length}
                </span>{" "}
                devices
              </p>
            )}
        </hgroup>
      </header>

      <div>
        <DeviceComparisonForm
          allDevices={allDevices}
          devicesToCompare={devicesToCompare}
          similarDevices={similarDevices}
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <PiChartLine />
                &nbsp;Show ranking chart
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
                />
              </div>
            </div>
          </details>
        </div>
      )}
      <details>
        <summary class="flex">
          <div style={{ display: "flex", alignItems: "center" }}>
            <PiInfo />
            &nbsp;How does this ranking work?
          </div>
        </summary>
        <div>
          <p>
            The ranking is based on all relevant properties of the devices.
            <br />
            Every property is given a score and placed into a category. The
            categories are then weighted and summed up to get the final results.
            <br />
            Category weights:
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}
            >
              <ul>
                <li>Performance (30%)</li>
                <li>Monitor (10%)</li>
                <li>Dimensions (10%)</li>
              </ul>
              <ul>
                <li>Connectivity (20%)</li>
                <li>Audio (10%)</li>
                <li>Controls (10%)</li>
              </ul>
              <ul>
                <li>Misc (10%)</li>
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
              Blue means equal.
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
              Green means better.
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
              Red means worse.
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
