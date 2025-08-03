import { PiGameController } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { ControlsTable } from "../tables/controls-table.tsx";

interface ControlsSpecsProps {
  device: Device;
}

export function ControlsSpecs({ device }: ControlsSpecsProps) {
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
          <PiGameController />
          Controls
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <ControlsTable device={device} />
      </section>
    </details>
  );
}
