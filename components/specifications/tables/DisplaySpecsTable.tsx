import { Device } from "../../../data/models/device.model.ts";

interface DisplaySpecsTableProps {
  device: Device;
}

export function DisplaySpecsTable({ device }: DisplaySpecsTableProps) {
  const videoOutputList = () => {
    const videoOutputs = [];
    if (device.outputs.videoOutput?.hasUsbC) {
      videoOutputs.push("USB-C");
    }
    if (device.outputs.videoOutput?.hasMicroHdmi) {
      videoOutputs.push("Micro HDMI");
    }
    if (device.outputs.videoOutput?.hasMiniHdmi) {
      videoOutputs.push("Mini HDMI");
    }
    if (device.outputs.videoOutput?.hasHdmi) {
      videoOutputs.push("HDMI");
    }
    if (device.outputs.videoOutput?.hasDvi) {
      videoOutputs.push("DVI");
    }
    if (device.outputs.videoOutput?.hasVga) {
      videoOutputs.push("VGA");
    }
    if (device.outputs.videoOutput?.hasDisplayPort) {
      videoOutputs.push("DisplayPort");
    }
    if (device.outputs.videoOutput?.OcuLink) {
      videoOutputs.push("OcuLink");
    }
    if (device.outputs.videoOutput?.AV) {
      videoOutputs.push("AV");
    }
    return videoOutputs.join(", ");
  };

  return (
    <table class="striped">
      <tbody>
        {device.screen.size && (
          <tr>
            <th>Screen Size</th>
            <td>{device.screen.size}"</td>
          </tr>
        )}
        {device.screen.type?.raw && (
          <tr>
            <th>Panel Type</th>
            <td>
              {device.screen.type.type}
              {device.screen.type.isTouchscreen && " (Touchscreen)"}
              {device.screen.type.isPenCapable && " (Pen Capable)"}
            </td>
          </tr>
        )}
        {device.screen.resolution && device.screen.resolution.length > 0 && (
          <tr>
            <th>Resolution</th>
            <td>
              {device.screen.resolution.map((res) => (
                <div key={res.raw}>
                  {res.width}x{res.height}
                </div>
              ))}
            </td>
          </tr>
        )}
        {device.screen.aspectRatio && (
          <tr>
            <th>Aspect Ratio</th>
            <td>{device.screen.aspectRatio}</td>
          </tr>
        )}
        {device.screen.ppi && device.screen.ppi.length > 0 && (
          <tr>
            <th>PPI</th>
            <td>{device.screen.ppi.join(", ")}</td>
          </tr>
        )}
        {device.outputs.videoOutput
          ? (
            <tr>
              <th>Video Output</th>
              <td>
                {videoOutputList()}
              </td>
            </tr>
          )
          : (
            <tr>
              <th>Video Output</th>
              <td>❌</td>
            </tr>
          )}
        {device.screen.type?.isTouchscreen && (
          <tr>
            <th>Touch Input</th>
            <td>Yes</td>
          </tr>
        )}
        {device.screen.type?.isPenCapable && (
          <tr>
            <th>Pen Support</th>
            <td>Yes</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
