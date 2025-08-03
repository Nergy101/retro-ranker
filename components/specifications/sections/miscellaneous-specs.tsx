import { PiGear } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { MiscellaneousSpecsTable } from "../tables/miscellaneous-specs-table.tsx";

interface MiscellaneousSpecsProps {
  device: Device;
}

export function MiscellaneousSpecs(
  { device }: MiscellaneousSpecsProps,
) {
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
          <PiGear />
          Miscellaneous
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <MiscellaneousSpecsTable device={device} />
      </section>
    </details>
  );
}
