import { PiSpeakerHigh } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { AudioTable } from "../tables/audio-table.tsx";

interface AudioSpecsProps {
  device: Device;
}

export function AudioSpecs({ device }: AudioSpecsProps) {
  return (
    <details>
      <summary
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          margin: 0,
        }}
      >
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PiSpeakerHigh />
          Audio
        </h3>
      </summary>
      <section class="specs-section overflow-auto">
        <AudioTable device={device} />
      </section>
    </details>
  );
}
