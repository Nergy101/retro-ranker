import { PiGear } from "@preact-icons/pi";
import { Device } from "../../../data/device.model.ts";
import { MiscellaneousSpecsTable } from "../tables/MiscellaneousSpecsTable.tsx";

interface MiscellaneousSpecsProps {
  device: Device;
}

export function MiscellaneousSpecs({ device }: MiscellaneousSpecsProps) {
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
