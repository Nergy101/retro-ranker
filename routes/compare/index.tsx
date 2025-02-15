import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { PiChartLine, PiInfo } from "@preact-icons/pi";
import { DeviceComparisonResult } from "../../components/comparisons/DeviceComparisonResult.tsx";
import { DevicesRadarChart } from "../../islands/charts/devices-radar-chart.tsx";
import { DeviceComparisonForm } from "../../islands/forms/DeviceComparisonForm.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";
import { RatingsService } from "../../services/devices/ratings.service.ts";

export default function DevicesIndex(props: PageProps) {
  const deviceService = DeviceService.getInstance();
  const ratingsService = RatingsService.getInstance();

  const devices = props.url?.search.split("=")?.[1]?.split(",") || [];

  const devicesToCompare = devices.map((d) => deviceService.getDeviceByName(d))
    .filter((device) => device !== null);

  const deviceNames = devicesToCompare.map((device) => device.name.raw);
  const allDevices = deviceService.getAllDevices()
    .sort((a, b) => a.name.raw.localeCompare(b.name.raw));

  const similarDevices = devicesToCompare.flatMap((device) =>
    deviceService.getSimilarDevices(device.name.sanitized, 8)
  );

  const ranking = ratingsService.createRanking(devicesToCompare);

  return (
    <div class="compare-page">
      <Head>
        <title>Retro Ranker - Compare Devices</title>
      </Head>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Compare Devices</h1>
          {deviceNames.length > 0 && (
            <p>
              Comparing the following devices: <br />
              {deviceNames.join(", ")}
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

      <div class="ranking-info">
        <details>
          <summary class="flex">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiInfo />
              &nbsp;How does this ranking work?
            </div>
          </summary>
          <div>
            <p>
              The ranking you are looking at is based on all relevant properties
              of the devices.
              <br />
              Every property is given a score and placed into a category. The
              categories are then weighted and summed up to get the final
              results.
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
      </div>

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

      <div class="compare-container">
        {devicesToCompare.map((device) => (
          <DeviceComparisonResult device={device} ranking={ranking} />
        ))}
      </div>
    </div>
  );
}
