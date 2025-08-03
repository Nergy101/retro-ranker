import { PiCpu } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { ProcessingSpecsTable } from "../tables/processing-specs-table.tsx";

interface ProcessingSpecsProps {
  device: Device;
}

export function ProcessingSpecs({ device }: ProcessingSpecsProps) {
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
          <PiCpu />
          Processing
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <ProcessingSpecsTable device={device} />
      </section>
    </details>
  );
}
