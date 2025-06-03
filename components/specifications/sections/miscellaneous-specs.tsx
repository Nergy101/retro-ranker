import { PiGear } from "@preact-icons/pi";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { MiscellaneousSpecsTable } from "../tables/miscellaneous-specs-table.tsx";

interface MiscellaneousSpecsProps {
  device: Device;
}

export function MiscellaneousSpecs(
  { device }: MiscellaneousSpecsProps,
) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiGear />
        Miscellaneous
      </h3>
      <MiscellaneousSpecsTable device={device} />
    </section>
  );
}
