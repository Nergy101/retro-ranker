import { Device } from "../../../data/models/device.model.ts";

interface PhysicalSpecsTableProps {
  device: Device;
}

export function PhysicalSpecsTable({ device }: PhysicalSpecsTableProps) {
  return (
    <table class="striped">
      <tbody>
        {device.dimensions && (
          <tr>
            <th>Dimensions</th>
            <td>
              {device.dimensions.length}mm x {device.dimensions.width}mm x{" "}
              {device.dimensions.height}mm
            </td>
          </tr>
        )}
        {device.weight && (
          <tr>
            <th>Weight</th>
            <td>
              {device.weight} grams
            </td>
          </tr>
        )}
        {device.battery && (
          <tr>
            <th>Battery</th>
            <td>
              {device.battery.capacity} {device.battery.unit}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
