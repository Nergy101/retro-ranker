import { PiWifiHigh } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { ConnectivityTable } from "../tables/connectivity-table.tsx";

interface ConnectivitySpecsProps {
  device: Device;
}

export function ConnectivitySpecs({ device }: ConnectivitySpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiWifiHigh />
        Connectivity
      </h3>
      <ConnectivityTable device={device} />
    </section>
  );
}
