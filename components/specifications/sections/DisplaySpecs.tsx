import { PiMonitor } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

interface DisplaySpecsProps {
  device: Device;
}

export function DisplaySpecs({ device }: DisplaySpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiMonitor />
        Display
      </h3>
      <table class="striped">
        <tbody>
          {device.screen.size && (
            <tr>
              <th>Screen Size</th>
              <td>{device.screen.size}</td>
            </tr>
          )}
          {device.screen.type && (
            <tr>
              <th>Panel Type</th>
              <td>{device.screen.type}</td>
            </tr>
          )}
          {device.screen.resolution && (
            <tr>
              <th>Resolution</th>
              <td>{device.screen.resolution}</td>
            </tr>
          )}
          {device.screen.aspectRatio && (
            <tr>
              <th>Aspect Ratio</th>
              <td>{device.screen.aspectRatio}</td>
            </tr>
          )}
          {device.screen.ppi && (
            <tr>
              <th>PPI</th>
              <td>{device.screen.ppi}</td>
            </tr>
          )}
          {device.outputs.videoOutput && (
            <tr>
              <th>Video Output</th>
              <td>{device.outputs.videoOutput}</td>
            </tr>
          )}
          {device.outputs.audioOutput && (
            <tr>
              <th>Audio Output</th>
              <td>{device.outputs.audioOutput}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 