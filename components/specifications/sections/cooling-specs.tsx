import { PiFan } from "@preact-icons/pi";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { CoolingSpecsTable } from "../tables/cooling-specs-table.tsx";

interface CoolingSpecsProps {
  device: Device;
}

export default function CoolingSpecs({ device }: CoolingSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiFan />
        Cooling
      </h3>
      <CoolingSpecsTable device={device} />
    </section>
  );
}
