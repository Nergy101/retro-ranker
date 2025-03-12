import { PiMonitor } from "@preact-icons/pi";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DisplaySpecsTable } from "../tables/DisplaySpecsTable.tsx";

interface DisplaySpecsProps {
  device: Device;
}

export function DisplaySpecs({ device }: DisplaySpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiMonitor />
        Display
      </h3>
      <DisplaySpecsTable device={device} />
    </section>
  );
}
