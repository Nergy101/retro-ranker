import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceHelpers } from "../../../data/frontend/helpers/device.helpers.ts";

interface AudioTableProps {
  device: Device;
}

export function AudioTable({ device }: AudioTableProps) {
  const getDeviceAudioOutput = (device: Device) => {
    const audioOutputs = [];
    if (device.outputs?.audioOutput?.has35mmJack) audioOutputs.push("3.5mm");
    if (device.outputs?.audioOutput?.hasHeadphoneJack) {
      audioOutputs.push("Headphone");
    }
    if (device.outputs?.audioOutput?.hasUsbC) audioOutputs.push("USB-C");
    return audioOutputs.length > 0 ? audioOutputs.join(", ") : null;
  };

  const deviceAudioOutput = getDeviceAudioOutput(device);

  return (
    <table class="striped">
      <tbody>
        {deviceAudioOutput
          ? (
            <tr>
              <th>Audio Output</th>
              <td>{deviceAudioOutput}</td>
            </tr>
          )
          : (
            <tr>
              <th>Audio Output</th>
              <td>
                {DeviceHelpers.getPropertyIconByCharacter("❌")}
              </td>
            </tr>
          )}
        {device.outputs?.speaker?.type
          ? (
            <tr>
              <th>Speakers</th>
              <td>{device.outputs.speaker.type}</td>
            </tr>
          )
          : (
            <tr>
              <th>Speakers</th>
              <td>
                {DeviceHelpers.getPropertyIconByCharacter("❌")}
              </td>
            </tr>
          )}
      </tbody>
    </table>
  );
}

export default AudioTable;
