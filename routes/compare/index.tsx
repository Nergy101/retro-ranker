import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import { DeviceComparisonResult } from "../../components/DeviceComparisonResult.tsx";
import { DeviceComparisonForm } from "../../islands/DeviceComparisonForm.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function DevicesIndex(props: PageProps) {
  const deviceService = DeviceService.getInstance();

  const devices = props.url?.searchParams?.get("devices") || "";
  const devicesArray = devices.split(",");
  const devicesToCompare = devicesArray.map((device) =>
    deviceService.getDeviceByName(device)
  ).filter((device) => device !== null);

  const deviceNames = devicesToCompare.map((device) => device.name.raw);

  const allDevices = deviceService.getAllDevices();

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
        <DeviceComparisonForm allDevices={allDevices} />
      </div>

      <div class="compare-container">
        {devicesToCompare.map((device) => (
          <DeviceComparisonResult device={device} />
        ))}
      </div>
    </div>
  );
}
