import { PiCpu } from "@preact-icons/pi";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { ProcessingSpecsTable } from "../tables/ProcessingSpecsTable.tsx";

interface ProcessingSpecsProps {
  device: Device;
}

export function ProcessingSpecs({ device }: ProcessingSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiCpu />
        Processing
      </h3>
      <ProcessingSpecsTable device={device} />
    </section>
  );
}
