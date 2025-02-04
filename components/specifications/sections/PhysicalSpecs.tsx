import { PiRuler } from "@preact-icons/pi";
import { Device } from "../../../data/device.model.ts";
import { PhysicalSpecsTable } from "../tables/PhysicalSpecsTable.tsx";

interface PhysicalSpecsProps {
  device: Device;
}

export function PhysicalSpecs({ device }: PhysicalSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiRuler />
        Physical
      </h3>
      <PhysicalSpecsTable device={device} />
    </section>
  );
}
