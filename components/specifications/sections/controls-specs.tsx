import { PiGameController } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { ControlsTable } from "../tables/controls-table.tsx";

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
