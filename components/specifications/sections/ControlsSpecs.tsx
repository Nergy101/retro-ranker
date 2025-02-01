import { PiGameController, PiQuestionFill } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

interface ControlsSpecsProps {
  device: Device;
}

export function ControlsSpecs({ device }: ControlsSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiGameController />
        Controls
      </h3>
      <table class="striped">
        <tbody>
          {device.controls.dPad && (
            <tr>
              <th>D-Pad</th>
              <td>{device.controls.dPad}</td>
            </tr>
          )}
          {device.controls.analogs?.length > 0 && (
            <tr>
              <th>Analog Sticks</th>
              <td>{device.controls.analogs.join(", ")}</td>
            </tr>
          )}
          {device.controls.faceButtons && (
            <tr>
              <th>Face Buttons</th>
              <td>{device.controls.faceButtons}</td>
            </tr>
          )}
          {device.controls.shoulderButtons && (
            <tr>
              <th>Shoulder Buttons</th>
              <td>{device.controls.shoulderButtons}</td>
            </tr>
          )}
          {device.rumble && (
            <tr>
              <th>Rumble</th>
              <td>
                {device.rumble === "?"
                  ? (
                    <PiQuestionFill
                      style={{ color: "#3155bc", fontSize: "1.5rem" }}
                    />
                  )
                  : device.rumble}
              </td>
            </tr>
          )}
          {device.sensors?.length > 0 && (
            <tr>
              <th>Sensors</th>
              <td>{device.sensors.join(", ")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 