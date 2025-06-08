import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { ShellMaterial } from "@/models/mod.ts";
import { DeviceService } from "../../../data/frontend/services/devices/device.service.ts";

interface PhysicalSpecsTableProps {
  device: Device;
}

export function PhysicalSpecsTable({ device }: PhysicalSpecsTableProps) {
  const getShellMaterialName = (
    device: Device,
    shellMaterial: ShellMaterial,
  ) => {
    if (shellMaterial.isMetal) return "Metal";
    if (shellMaterial.isPlastic) return "Plastic";
    if (shellMaterial.isAluminum) return "Aluminum";
    if (shellMaterial.isMagnesiumAlloy) return "Magnesium Alloy";
    return device.shellMaterial?.raw || "Other";
  };

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
        {device.weight
          ? (
            <tr>
              <th>Weight</th>
              <td>
                {device.weight} grams
              </td>
            </tr>
          )
          : (
            <tr>
              <th>Weight</th>
              <td>
                {DeviceService.getPropertyIconByCharacter(null)}
              </td>
            </tr>
          )}
        {device.battery && (
          <tr>
            <th>Battery</th>
            <td>
              {device.battery.capacity
                ? device.battery.capacity + " " + device.battery.unit
                : DeviceService.getPropertyIconByCharacter(null)}
            </td>
          </tr>
        )}
        {device.shellMaterial
          ? (
            <tr>
              <th>Shell Material</th>
              <td>{getShellMaterialName(device, device.shellMaterial)}</td>
            </tr>
          )
          : (
            <tr>
              <th>Shell Material</th>
              <td>
                {DeviceService.getPropertyIconByCharacter(null)}
              </td>
            </tr>
          )}
      </tbody>
    </table>
  );
}

export default PhysicalSpecsTable;
