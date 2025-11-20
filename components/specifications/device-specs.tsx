import { Device } from "../../data/frontend/contracts/device.model.ts";
import { UnifiedSpecs } from "./sections/unified-specs.tsx";

interface DeviceSpecsProps {
  device: Device;
}

export function DeviceSpecs({ device }: DeviceSpecsProps) {
  return (
    <div class="specs-container">
      <UnifiedSpecs device={device} />
    </div>
  );
}
