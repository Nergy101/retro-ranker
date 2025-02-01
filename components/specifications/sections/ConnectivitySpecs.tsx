import { PiWifiHigh } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

interface ConnectivitySpecsProps {
  device: Device;
}

export function ConnectivitySpecs({ device }: ConnectivitySpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiWifiHigh />
        Connectivity
      </h3>
      <table class="striped">
        <tbody>
          {device.connectivity && (
            <>
              <tr>
                <th>Wifi</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasWifi,
                  )}
                </td>
              </tr>
              <tr>
                <th>Bluetooth</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasBluetooth,
                  )}
                </td>
              </tr>
              <tr>
                <th>NFC</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasNFC,
                  )}
                </td>
              </tr>
              <tr>
                <th>USB</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasUSB,
                  )}
                </td>
              </tr>
              <tr>
                <th>HDMI</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasHDMI,
                  )}
                </td>
              </tr>
              <tr>
                <th>DisplayPort</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasDisplayPort,
                  )}
                </td>
              </tr>
              <tr>
                <th>VGA</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasVGA,
                  )}
                </td>
              </tr>
              <tr>
                <th>DVI</th>
                <td>
                  {DeviceService.getPropertyIconByBool(
                    device.connectivity.hasDVI,
                  )}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </section>
  );
} 