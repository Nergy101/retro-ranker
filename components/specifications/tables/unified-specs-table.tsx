import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { PiCheckCircleFill, PiXCircle } from "@preact-icons/pi";

interface UnifiedSpecsTableProps {
  device: Device;
}

const toBoolOrNull = (value: boolean | null | undefined): boolean | null => {
  return value === undefined ? null : value;
};

const getPropertyIconByBool = (bool: boolean | null | undefined) => {
  return bool
    ? PiCheckCircleFill({
      style: {
        color: "#22c55e",
        fontSize: "1.5rem",
      },
    })
    : PiXCircle({
      style: {
        color: "#ef4444",
        fontSize: "1.5rem",
      },
    });
};

export function UnifiedSpecsTable({ device }: UnifiedSpecsTableProps) {
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
    <>
      <style>
        {`
        .subheader-row {
          background-color: var(--pico-muted-border-color);
        }
        
        .subheader {
          text-align: center;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: var(--pico-primary);
          border-bottom: 2px solid var(--pico-primary-hover);
        }
        
        .subheader strong {
          font-weight: 600;
        }
        `}
      </style>

      <table class="striped">
        <tbody>
          {/* Processing Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Processing</strong>
            </th>
          </tr>
          {device.cpus?.[0]?.name && (
            <tr>
              <th>CPU</th>
              <td>
                {device.cpus[0].name}
                {device.cpus[0].cores && ` (${device.cpus[0].cores} cores)`}
                {device.cpus[0].frequency && ` @ ${device.cpus[0].frequency}`}
              </td>
            </tr>
          )}
          {device.gpus?.[0]?.name && (
            <tr>
              <th>GPU</th>
              <td>{device.gpus[0].name}</td>
            </tr>
          )}
          {device.ram && (
            <tr>
              <th>RAM</th>
              <td>
                {device.ram.sizes?.join(", ") || "Unknown"}
                {device.ram.unit && ` ${device.ram.unit}`}
                {device.ram.type && ` ${device.ram.type.toUpperCase()}`}
              </td>
            </tr>
          )}
          {device.storage && (
            <tr>
              <th>Storage</th>
              <td>{device.storage}</td>
            </tr>
          )}

          {/* Display Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Display</strong>
            </th>
          </tr>
          {device.screen?.size && (
            <tr>
              <th>Size</th>
              <td>{device.screen.size}"</td>
            </tr>
          )}
          {device.screen?.resolution && (
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
          {device.screen?.type && (
            <tr>
              <th>Type</th>
              <td>
                {device.screen.type.type}{" "}
                {device.screen.type.isTouchscreen && " (Touch)"}{" "}
                {device.screen.type.isPenCapable && " (Pen)"}
              </td>
            </tr>
          )}
          {device.screen?.aspectRatio && (
            <tr>
              <th>Aspect Ratio</th>
              <td>{device.screen.aspectRatio}</td>
            </tr>
          )}
          {device.screen?.refreshRate && (
            <tr>
              <th>Refresh Rate</th>
              <td>{device.screen.refreshRate}</td>
            </tr>
          )}

          {/* Connectivity Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Connectivity</strong>
            </th>
          </tr>
          <tr>
            <th>USB-C</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.connectivity?.hasUsbC),
              )}
            </td>
          </tr>
          <tr>
            <th>WiFi</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.connectivity?.hasWifi),
              )}
            </td>
          </tr>
          <tr>
            <th>Bluetooth</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.connectivity?.hasBluetooth),
              )}
            </td>
          </tr>
          <tr>
            <th>NFC</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.connectivity?.hasNfc),
              )}
            </td>
          </tr>
          <tr>
            <th>USB</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.connectivity?.hasUsb),
              )}
            </td>
          </tr>

          {/* Video Output Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Video Output</strong>
            </th>
          </tr>
          <tr>
            <th>HDMI</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasHdmi),
              )}
            </td>
          </tr>
          <tr>
            <th>DisplayPort</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasDisplayPort),
              )}
            </td>
          </tr>
          <tr>
            <th>VGA</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasVga),
              )}
            </td>
          </tr>
          <tr>
            <th>DVI</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasDvi),
              )}
            </td>
          </tr>
          <tr>
            <th>Micro HDMI</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasMicroHdmi),
              )}
            </td>
          </tr>
          <tr>
            <th>Mini HDMI</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.hasMiniHdmi),
              )}
            </td>
          </tr>
          <tr>
            <th>OcuLink</th>
            <td>
              {getPropertyIconByBool(
                toBoolOrNull(device.outputs?.videoOutput?.OcuLink),
              )}
            </td>
          </tr>

          {/* Audio Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Audio</strong>
            </th>
          </tr>
          <tr>
            <th>Audio Output</th>
            <td>
              {deviceAudioOutput ? deviceAudioOutput : (
                <PiXCircle
                  style={{ color: "#ef4444", fontSize: "1.5rem" }}
                />
              )}
            </td>
          </tr>
          <tr>
            <th>Speakers</th>
            <td>
              {device.outputs?.speaker?.type
                ? device.outputs.speaker.type
                : (
                  <PiXCircle
                    style={{ color: "#ef4444", fontSize: "1.5rem" }}
                  />
                )}
            </td>
          </tr>

          {/* Physical Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Physical</strong>
            </th>
          </tr>
          {device.dimensions && (
            <tr>
              <th>Dimensions</th>
              <td>
                {device.dimensions
                  ? `${device.dimensions.length}x${device.dimensions.width}x${device.dimensions.height}`
                  : "Unknown"}
              </td>
            </tr>
          )}
          {device.weight && (
            <tr>
              <th>Weight</th>
              <td>{device.weight}</td>
            </tr>
          )}
          {device.formFactor && (
            <tr>
              <th>Form Factor</th>
              <td>{device.formFactor}</td>
            </tr>
          )}
          {device.shellMaterial && (
            <tr>
              <th>Material</th>
              <td>{device.shellMaterial?.raw || "Unknown"}</td>
            </tr>
          )}
          {device.colors && device.colors.length > 0 && (
            <tr>
              <th>Color</th>
              <td>{device.colors.join(", ")}</td>
            </tr>
          )}

          {/* Battery Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Battery</strong>
            </th>
          </tr>
          {device.battery?.capacity && (
            <tr>
              <th>Capacity</th>
              <td>{device.battery.capacity} {device.battery.unit || "mAh"}</td>
            </tr>
          )}
          {device.battery?.type && (
            <tr>
              <th>Type</th>
              <td>{device.battery.type}</td>
            </tr>
          )}
          {device.battery?.removable && (
            <tr>
              <th>Removable</th>
              <td>{device.battery.removable ? "Yes" : "No"}</td>
            </tr>
          )}
          {device.battery?.charging && (
            <tr>
              <th>Charging</th>
              <td>{device.battery.charging}</td>
            </tr>
          )}

          {/* Controls Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Controls</strong>
            </th>
          </tr>
          {device.controls?.dpad && (
            <tr>
              <th>D-Pad</th>
              <td>{device.controls.dpad}</td>
            </tr>
          )}
          {device.controls?.faceButtons && (
            <tr>
              <th>Face Buttons</th>
              <td>{device.controls.faceButtons}</td>
            </tr>
          )}
          {device.controls?.shoulderButtons?.raw && (
            <tr>
              <th>Shoulder Buttons</th>
              <td>
                {[
                  device.controls.shoulderButtons.ZL && "ZL",
                  device.controls.shoulderButtons.ZRVertical && "ZR Vertical",
                  device.controls.shoulderButtons.ZRHorizontal &&
                  "ZR Horizontal",
                  device.controls.shoulderButtons.L && "L",
                  device.controls.shoulderButtons.L1 && "L1",
                  device.controls.shoulderButtons.L2 && "L2",
                  device.controls.shoulderButtons.L3 && "L3",
                  device.controls.shoulderButtons.R && "R",
                  device.controls.shoulderButtons.R1 && "R1",
                  device.controls.shoulderButtons.R2 && "R2",
                  device.controls.shoulderButtons.R3 && "R3",
                  device.controls.shoulderButtons.M1 && "M1",
                  device.controls.shoulderButtons.M2 && "M2",
                  device.controls.shoulderButtons.LC && "LC",
                  device.controls.shoulderButtons.RC && "RC",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          )}
          {device.controls?.analogSticks && (
            <tr>
              <th>Analog Sticks</th>
              <td>{device.controls.analogSticks}</td>
            </tr>
          )}
          {device.controls?.touchscreen && (
            <tr>
              <th>Touchscreen</th>
              <td>{device.controls.touchscreen}</td>
            </tr>
          )}

          {/* Miscellaneous Section */}
          <tr class="subheader-row">
            <th colSpan={2} class="subheader">
              <strong>Miscellaneous</strong>
            </th>
          </tr>
          {device.os?.list && device.os.list.length > 0 && (
            <tr>
              <th>Operating System</th>
              <td>{device.os.list.join(", ")}</td>
            </tr>
          )}
          {device.os?.customFirmwares && device.os.customFirmwares.length > 0 &&
            (
              <tr>
                <th>Custom Firmware</th>
                <td>{device.os.customFirmwares.join(", ")}</td>
              </tr>
            )}
          {device.storage && (
            <tr>
              <th>Storage</th>
              <td>{device.storage}</td>
            </tr>
          )}
          {device.released?.raw && (
            <tr>
              <th>Release Date</th>
              <td>{device.released.raw}</td>
            </tr>
          )}
          {device.pricing?.category && (
            <tr>
              <th>Price Category</th>
              <td>{device.pricing.category}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
