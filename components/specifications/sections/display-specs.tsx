import { PiMonitor } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { DisplaySpecsTable } from "../tables/display-specs-table.tsx";

interface DisplaySpecsProps {
  device: Device;
}

export function DisplaySpecs({ device }: DisplaySpecsProps) {
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
          <PiMonitor />
          Display
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <DisplaySpecsTable device={device} />
      </section>
    </details>
  );
}
