import { Device } from "../../data/frontend/contracts/device.model.ts";
import { AudioSpecs } from "./sections/audio-specs.tsx";
import { ConnectivitySpecs } from "./sections/connectivity-specs.tsx";
import { ControlsSpecs } from "./sections/controls-specs.tsx";
import { CoolingSpecs } from "./sections/cooling-specs.tsx";
import { DisplaySpecs } from "./sections/display-specs.tsx";
import { MiscellaneousSpecs } from "./sections/miscellaneous-specs.tsx";
import { PhysicalSpecs } from "./sections/physical-specs.tsx";
import { ProcessingSpecs } from "./sections/processing-specs.tsx";

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
