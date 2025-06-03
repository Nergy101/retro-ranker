import { PiSpeakerHigh } from "@preact-icons/pi";
import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { AudioTable } from "../tables/audio-table.tsx";

interface AudioSpecsProps {
  device: Device;
}

export default function AudioSpecs({ device }: AudioSpecsProps) {
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
