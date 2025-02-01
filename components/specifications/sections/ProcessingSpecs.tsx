import { PiCpu } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

interface ProcessingSpecsProps {
  device: Device;
}

export function ProcessingSpecs({ device }: ProcessingSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiCpu />
        Processing
      </h3>
      <table class="striped">
        <tbody>
          {device.systemOnChip && (
            <tr>
              <th>System on Chip</th>
              <td>{device.systemOnChip}</td>
            </tr>
          )}
          {device.cpu && (
            <tr>
              <th>CPU</th>
              <td>
                {device.cpu.names.join(", ")}
                {device.cpu.cores && device.cpu.cores > 0 &&
                  ` (${device.cpu.cores} cores)`}
                {device.cpu.clockSpeed && ` @ ${device.cpu.clockSpeed}`}
              </td>
            </tr>
          )}
          {device.gpu && (
            <tr>
              <th>GPU</th>
              <td>
                {device.gpu.name}
                {device.gpu.cores && ` (${device.gpu.cores})`}
                {device.gpu.clockSpeed && ` @ ${device.gpu.clockSpeed}`}
              </td>
            </tr>
          )}
          {device.ram && (
            <tr>
              <th>RAM</th>
              <td>{device.ram}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 