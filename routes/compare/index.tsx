import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { DeviceComparisonResult } from "../../components/DeviceComparisonResult.tsx";
import { DeviceComparisonForm } from "../../islands/DeviceComparisonForm.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";
import { RatingsService } from "../../services/devices/ratings.service.ts";

export default function DevicesIndex(props: PageProps) {
  const deviceService = DeviceService.getInstance();
  const ratingsService = RatingsService.getInstance();

  const devices = props.url?.search.split("=")?.[1]?.split(",") || [];

  const devicesToCompare = devices.map((d) => deviceService.getDeviceByName(d))
    .filter((device) => device !== null);

  const deviceNames = devicesToCompare.map((device) => device.name.raw);
  const allDevices = deviceService.getAllDevices();

  const similarDevices = devicesToCompare.flatMap((device) =>
    deviceService.getSimilarDevices(device.name.sanitized, 8)
  );

  const ranking = ratingsService.createRanking(devicesToCompare);

  return (
    <div>
      <Head>
        <title>Retro Ranker - Compare Devices</title>
      </Head>
      <header>
        <hgroup style={{ textAlign: "center" }}>
          <h1>Compare Devices</h1>
          <p>
            Comparing the following devices: <br />
            {deviceNames.join(", ")}
          </p>
        </hgroup>
      </header>

      <div class="compare-form">
        <DeviceComparisonForm
          allDevices={allDevices}
          devicesToCompare={devicesToCompare}
          similarDevices={similarDevices}
        />
      </div>

      <div class="compare-container">
        {devicesToCompare.map((device) => (
          <DeviceComparisonResult device={device} ranking={ranking} />
        ))}
      </div>
    </div>
  );
}
