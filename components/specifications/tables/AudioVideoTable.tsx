import { Device } from "../../../data/models/device.model.ts";

interface AudioVideoTableProps {
  device: Device;
}

export function AudioVideoTable({ device }: AudioVideoTableProps) {
  const getDeviceAudioOutput = (device: Device) => {
    const audioOutputs = [];
    if (device.outputs.audioOutput?.has35mmJack) audioOutputs.push("3.5mm");
    if (device.outputs.audioOutput?.hasHeadphoneJack) {
      audioOutputs.push("Headphone");
    }
    if (device.outputs.audioOutput?.hasUsbC) audioOutputs.push("USB-C");
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
              <td>❌</td>
            </tr>
          )}
        {device.outputs.speaker?.type
          ? (
            <tr>
              <th>Speakers</th>
              <td>{device.outputs.speaker.type}</td>
            </tr>
          )
          : (
            <tr>
              <th>Speakers</th>
              <td>❌</td>
            </tr>
          )}
      </tbody>
    </table>
  );
}
