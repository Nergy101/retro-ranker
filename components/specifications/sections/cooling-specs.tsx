import { PiFan } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { CoolingSpecsTable } from "../tables/cooling-specs-table.tsx";

interface CoolingSpecsProps {
  device: Device;
}

export function CoolingSpecs({ device }: CoolingSpecsProps) {
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
          <PiFan />
          Cooling
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <CoolingSpecsTable device={device} />
      </section>
    </details>
  );
}
