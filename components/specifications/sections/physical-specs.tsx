import { PiRuler } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { PhysicalSpecsTable } from "../tables/physical-specs-table.tsx";

interface PhysicalSpecsProps {
  device: Device;
}

export function PhysicalSpecs({ device }: PhysicalSpecsProps) {
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
          <PiRuler />
          Physical
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <PhysicalSpecsTable device={device} />
      </section>
    </details>
  );
}
