import { PiSpeakerHigh } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";
import { AudioVideoTable } from "../tables/AudioVideoTable.tsx";

interface AudioVideoSpecsProps {
  device: Device;
}

export function AudioVideoSpecs({ device }: AudioVideoSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiSpeakerHigh />
        Audio
      </h3>
      <AudioVideoTable device={device} />
    </section>
  );
}
