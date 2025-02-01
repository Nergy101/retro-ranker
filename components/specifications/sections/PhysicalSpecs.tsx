import { PiRuler } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

interface PhysicalSpecsProps {
  device: Device;
}

export function PhysicalSpecs({ device }: PhysicalSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiRuler />
        Physical
      </h3>
      <table class="striped">
        <tbody>
          {device.dimensions && (
            <tr>
              <th>Dimensions</th>
              <td>{device.dimensions}</td>
            </tr>
          )}
          {device.weight && (
            <tr>
              <th>Weight</th>
              <td>{device.weight}</td>
            </tr>
          )}
          {device.battery && (
            <tr>
              <th>Battery</th>
              <td>{device.battery}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 