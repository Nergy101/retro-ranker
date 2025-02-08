import { Device } from "../../../data/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";
interface ControlsTableProps {
  device: Device;
}

export function ControlsTable({ device }: ControlsTableProps) {
  const getSensors = () => {
    const sensors = [];
    if (device.sensors?.hasMicrophone) sensors.push("Microphone");
    if (device.sensors?.hasAccelerometer) sensors.push("Accelerometer");
    if (device.sensors?.hasGyroscope) sensors.push("Gyroscope");
    if (device.sensors?.hasCompass) sensors.push("Compass");
    if (device.sensors?.hasMagnetometer) sensors.push("Magnetometer");
    if (device.sensors?.hasBarometer) sensors.push("Barometer");
    if (device.sensors?.hasProximitySensor) sensors.push("Proximity");
    if (device.sensors?.hasAmbientLightSensor) sensors.push("Ambient Light");
    if (device.sensors?.hasFingerprintSensor) sensors.push("Fingerprint");
    if (device.sensors?.hasCamera) sensors.push("Camera");
    if (device.sensors?.hasGravitySensor) sensors.push("Gravity");
    if (device.sensors?.hasPressureSensor) sensors.push("Pressure");
    if (device.sensors?.hasTemperatureSensor) sensors.push("Temperature");
    if (device.sensors?.hasHumiditySensor) sensors.push("Humidity");
    if (device.sensors?.hasHeartRateSensor) sensors.push("Heart Rate");
    if (device.sensors?.hasAntenna) sensors.push("Antenna");
    if (device.sensors?.screenClosure) sensors.push("Screen Closure");
    return sensors;
  };

  const getAnalogSticks = () => {
    if (!device.controls.analogs) return null;
    const analogSticksText = [
      device.controls.analogs.dual && "Dual",
      device.controls.analogs.single && "Single",
      device.controls.analogs.isHallSensor && "Hall Sensor",
      device.controls.analogs.isThumbstick && "Thumbstick",
      device.controls.analogs.isSlidepad && "Slidepad",
      device.controls.analogs.L3 && "L3",
      device.controls.analogs.R3 && "R3",
    ]
      .filter(Boolean)
      .join(", ");
    if (analogSticksText.length === 0) return null;
    return analogSticksText;
  };

  const sensors = getSensors();

  return (
    <table class="striped">
      <tbody>
        {device.controls.dPad?.raw && (
          <tr>
            <th>D-Pad</th>
            <td>{device.controls.dPad.type}</td>
          </tr>
        )}
        {getAnalogSticks()
          ? (
            <tr>
              <th>Analog Sticks</th>
              <td>
                {getAnalogSticks()}
              </td>
            </tr>
          )
          : (
            <tr>
              <th>Analog Sticks</th>
              <td>
                {DeviceService.getPropertyIconByCharacter("❌")}
              </td>
            </tr>
          )}
        {device.controls.numberOfFaceButtons && (
          <tr>
            <th>Face Buttons</th>
            <td>{device.controls.numberOfFaceButtons}</td>
          </tr>
        )}
        {device.controls.shoulderButtons?.raw && (
          <tr>
            <th>Shoulder Buttons</th>
            <td>
              {[
                device.controls.shoulderButtons.ZL && "ZL",
                device.controls.shoulderButtons.ZRVertical && "ZR Vertical",
                device.controls.shoulderButtons.ZRHorizontal && "ZR Horizontal",
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
        {device.controls.extraButtons && (
          <tr>
            <th>Extra Buttons</th>
            <td>
              {[
                device.controls.extraButtons.power && "Power",
                device.controls.extraButtons.reset && "Reset",
                device.controls.extraButtons.home && "Home",
                device.controls.extraButtons.volumeUp && "Volume Up",
                device.controls.extraButtons.volumeDown && "Volume Down",
                device.controls.extraButtons.function && "Function",
                device.controls.extraButtons.turbo && "Turbo",
                device.controls.extraButtons.touchpad && "Touchpad",
                device.controls.extraButtons.fingerprint && "Fingerprint",
                device.controls.extraButtons.mute && "Mute",
                device.controls.extraButtons.screenshot && "Screenshot",
                device.controls.extraButtons.programmableButtons &&
                "Programmable Buttons",
              ]
                .filter(Boolean)
                .join(", ")}
            </td>
          </tr>
        )}
        {device.rumble !== null && (
          <tr>
            <th>Rumble</th>
            <td>
              {DeviceService.getPropertyIconByBool(device.rumble)}
            </td>
          </tr>
        )}
        {sensors.length > 0 && (
          <tr>
            <th>Sensors</th>
            <td>
              {sensors.join(", ")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
