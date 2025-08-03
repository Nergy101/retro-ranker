import { PiWifiHigh } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { ConnectivityTable } from "../tables/connectivity-table.tsx";

interface ConnectivitySpecsProps {
  device: Device;
}

export function ConnectivitySpecs({ device }: ConnectivitySpecsProps) {
  return (
    <details>
      <summary
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          margin: 0,
        }}
      >
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PiWifiHigh />
          Connectivity
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <ConnectivityTable device={device} />
      </section>
    </details>
  );
}
