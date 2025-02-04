import { PiGameController } from "@preact-icons/pi";
import { Device } from "../../../data/device.model.ts";
import { ControlsTable } from "../tables/ControlsTable.tsx";

interface ControlsSpecsProps {
  device: Device;
}

export function ControlsSpecs({ device }: ControlsSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiGameController />
        Controls
      </h3>
      <ControlsTable device={device} />
    </section>
  );
}
