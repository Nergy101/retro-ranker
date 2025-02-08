import { PiSpeakerHigh } from "@preact-icons/pi";
import { Device } from "../../../data/device.model.ts";
import { AudioTable } from "../tables/AudioTable.tsx";

interface AudioSpecsProps {
  device: Device;
}

export function AudioSpecs({ device }: AudioSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiSpeakerHigh />
        Audio
      </h3>
      <AudioTable device={device} />
    </section>
  );
}
