import { Device } from "../../../data/models/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";
import { PiFan, PiListThin, PiPipe, PiTabs } from "@preact-icons/pi";

interface CoolingSpecsTableProps {
  device: Device;
}

export function CoolingSpecsTable({ device }: CoolingSpecsTableProps) {
  return (
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
  );
}
