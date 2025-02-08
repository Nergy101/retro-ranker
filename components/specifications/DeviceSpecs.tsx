import { Device } from "../../data/device.model.ts";
import { AudioSpecs } from "./sections/AudioSpecs.tsx";
import { ConnectivitySpecs } from "./sections/ConnectivitySpecs.tsx";
import { ControlsSpecs } from "./sections/ControlsSpecs.tsx";
import { CoolingSpecs } from "./sections/CoolingSpecs.tsx";
import { DisplaySpecs } from "./sections/DisplaySpecs.tsx";
import { MiscellaneousSpecs } from "./sections/MiscellaneousSpecs.tsx";
import { PhysicalSpecs } from "./sections/PhysicalSpecs.tsx";
import { ProcessingSpecs } from "./sections/ProcessingSpecs.tsx";

interface DeviceSpecsProps {
  device: Device;
}

export function DeviceSpecs({ device }: DeviceSpecsProps) {
  return (
    <div class="specs-grid">
      {/* Processing */}
      <ProcessingSpecs device={device} />

      {/* Display */}
      <DisplaySpecs device={device} />

      {/* Connectivity */}
      <ConnectivitySpecs device={device} />

      {/* Physical */}
      <PhysicalSpecs device={device} />

      {/* Cooling */}
      <CoolingSpecs device={device} />

      {/* Audio */}
      <AudioSpecs device={device} />

      {/* Controls */}
      <ControlsSpecs device={device} />

      {/* Miscellaneous */}
      <MiscellaneousSpecs device={device} />
    </div>
  );
}
