import { Device } from "../../../data/models/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

interface ConnectivityTableProps {
  device: Device;
}

const toBoolOrNull = (value: boolean | null | undefined): boolean | null => {
  return value === undefined ? null : value;
};

export function ConnectivityTable({ device }: ConnectivityTableProps) {
  return (
    <table class="striped">
      <tbody>
        {(device.connectivity || device.outputs) && (
          <>
            <tr>
              <th>USB-C</th>
              <td>
                {DeviceService.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasUsbC),
                )}
              </td>
            </tr>
            <tr>
              <th>Wifi</th>
              <td>
                {DeviceService.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasWifi),
                )}
              </td>
            </tr>
            <tr>
              <th>Bluetooth</th>
              <td>
                {DeviceService.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasBluetooth),
                )}
              </td>
            </tr>
            <tr>
              <th>NFC</th>
              <td>
                {DeviceService.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasNfc),
                )}
              </td>
            </tr>
            <tr>
              <th>USB</th>
              <td>
                {DeviceService.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasUsb),
                )}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}
