import { PiFan, PiTabs, PiPipe, PiListThin } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

interface CoolingSpecsProps {
  device: Device;
}

export function CoolingSpecs({ device }: CoolingSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiFan />
        Cooling
      </h3>
      <table class="striped">
        <tbody>
          <tr>
            <th>
              <span style={{ display: "flex", gap: "0.25rem" }}>
                <PiTabs /> Heatsink
              </span>
            </th>
            <td>
              {DeviceService.getPropertyIconByBool(device.cooling.hasHeatsink)}
            </td>
          </tr>
          <tr>
            <th>
              <span style={{ display: "flex", gap: "0.25rem" }}>
                <PiPipe /> Heat Pipe
              </span>
            </th>
            <td>
              {DeviceService.getPropertyIconByBool(device.cooling.hasHeatPipe)}
            </td>
          </tr>
          <tr>
            <th>
              <span style={{ display: "flex", gap: "0.25rem" }}>
                <PiFan /> Fan
              </span>
            </th>
            <td>
              {DeviceService.getPropertyIconByBool(device.cooling.hasFan)}
            </td>
          </tr>
          <tr>
            <th>
              <span style={{ display: "flex", gap: "0.25rem" }}>
                <PiListThin /> Ventilation Cutouts
              </span>
            </th>
            <td>
              {DeviceService.getPropertyIconByBool(
                device.cooling.hasVentilationCutouts,
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
} 