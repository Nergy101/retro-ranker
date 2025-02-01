import { PiSpeakerHigh } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

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
      <table class="striped">
        <tbody>
          {device.outputs.audioOutput && (
            <tr>
              <th>Audio Output</th>
              <td>{device.outputs.audioOutput}</td>
            </tr>
          )}
          {device.outputs.speaker && (
            <tr>
              <th>Speakers</th>
              <td>{device.outputs.speaker}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 