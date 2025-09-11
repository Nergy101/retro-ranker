import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceHelpers } from "../../../data/frontend/helpers/device.helpers.ts";

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
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasUsbC),
                )}
              </td>
            </tr>
            <tr>
              <th>Wifi</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasWifi),
                )}
              </td>
            </tr>
            <tr>
              <th>Bluetooth</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasBluetooth),
                )}
              </td>
            </tr>
            <tr>
              <th>NFC</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasNfc),
                )}
              </td>
            </tr>
            <tr>
              <th>USB</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.connectivity?.hasUsb),
                )}
              </td>
            </tr>
            <tr>
              <th>HDMI</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasHdmi),
                )}
              </td>
            </tr>
            <tr>
              <th>DisplayPort</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasDisplayPort),
                )}
              </td>
            </tr>
            <tr>
              <th>VGA</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasVga),
                )}
              </td>
            </tr>
            <tr>
              <th>DVI</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasDvi),
                )}
              </td>
            </tr>
            <tr>
              <th>Micro HDMI</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasMicroHdmi),
                )}
              </td>
            </tr>
            <tr>
              <th>Mini HDMI</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.hasMiniHdmi),
                )}
              </td>
            </tr>
            <tr>
              <th>OcuLink</th>
              <td>
                {DeviceHelpers.getPropertyIconByBool(
                  toBoolOrNull(device.outputs?.videoOutput?.OcuLink),
                )}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}

export default ConnectivityTable;
