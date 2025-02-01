import { Device } from "../../data/models/device.model.ts";
import { AudioVideoSpecs } from "./sections/AudioVideoSpecs.tsx";
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

      {/* Physical */}
      <PhysicalSpecs device={device} />

      {/* Cooling */}
      <CoolingSpecs device={device} />

      {/* Audio and Video */}
      <AudioVideoSpecs device={device} />

      {/* Controls */}
      <ControlsSpecs device={device} />

      {/* Miscellaneous */}
      <MiscellaneousSpecs device={device} />

      {/* Connectivity */}
      <ConnectivitySpecs device={device} />
    </div>
  );
}
