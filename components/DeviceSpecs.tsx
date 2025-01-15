import { Device } from "../data/devices/device.model.ts";

interface DeviceSpecsProps {
  device: Device;
}

export function DeviceSpecs({ device }: DeviceSpecsProps) {
  return (
    <div class="specs-grid">
      {/* Processing */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-cpu"></i>
          Processing
        </h3>
        <table>
          <tbody>
            {device.systemOnChip && (
              <tr>
                <th>System on Chip</th>
                <td>{device.systemOnChip}</td>
              </tr>
            )}
            {device.cpu && (
              <tr>
                <th>CPU</th>
                <td>
                  {device.cpu}
                  {device.cpuCores > 0 && ` (${device.cpuCores} cores)`}
                  {device.cpuClockSpeed && ` @ ${device.cpuClockSpeed}`}
                </td>
              </tr>
            )}
            {device.gpu && (
              <tr>
                <th>GPU</th>
                <td>
                  {device.gpu}
                  {device.gpuCores && ` (${device.gpuCores})`}
                  {device.gpuClockSpeed && ` @ ${device.gpuClockSpeed}`}
                </td>
              </tr>
            )}
            {device.ram && (
              <tr>
                <th>RAM</th>
                <td>{device.ram}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Display */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-monitor"></i>
          Display
        </h3>
        <table>
          <tbody>
            {device.screenSize && (
              <tr>
                <th>Screen Size</th>
                <td>{device.screenSize}</td>
              </tr>
            )}
            {device.screenType && (
              <tr>
                <th>Panel Type</th>
                <td>{device.screenType}</td>
              </tr>
            )}
            {device.resolution && (
              <tr>
                <th>Resolution</th>
                <td>{device.resolution}</td>
              </tr>
            )}
            {device.aspectRatio && (
              <tr>
                <th>Aspect Ratio</th>
                <td>{device.aspectRatio}</td>
              </tr>
            )}
            {device.ppi && (
              <tr>
                <th>PPI</th>
                <td>{device.ppi}</td>
              </tr>
            )}
            {device.videoOutput && (
              <tr>
                <th>Video Output</th>
                <td>{device.videoOutput}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Physical */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-ruler"></i>
          Physical
        </h3>
        <table>
          <tbody>
            {device.dimensions && (
              <tr>
                <th>Dimensions</th>
                <td>{device.dimensions}</td>
              </tr>
            )}
            {device.weight && (
              <tr>
                <th>Weight</th>
                <td>{device.weight}</td>
              </tr>
            )}
            {device.battery && (
              <tr>
                <th>Battery</th>
                <td>{device.battery}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Cooling */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-cooler"></i>
          Cooling
        </h3>
        <table>
          <tbody>
           
              <tr>
              <th>Heatsink</th>
              {device.cooling.hasHeatsink ? <td>✅</td> : <td>❌</td>}
            </tr>
              <tr>
                <th>Heat Pipe</th>
              {device.cooling.hasHeatPipe ? <td>✅</td> : <td>❌</td>}
            </tr>
            <tr>
              <th>Fan</th>
              {device.cooling.hasFan ? <td>✅</td> : <td>❌</td>}
            </tr>
            <tr>
              <th>Ventilation Cutouts</th>
              {device.cooling.hasVentilationCutouts ? <td>✅</td> : <td>❌</td>}
            </tr>
          </tbody>
        </table>
      </section>

      {/* Audio and Video */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-speaker-high"></i>
          Audio
        </h3>
        <table>
          <tbody>
            {device.audioOutput && (
              <tr>
                <th>Audio Output</th>
                <td>{device.audioOutput}</td>
              </tr>
            )}
            {device.speaker && (
              <tr>
                <th>Speakers</th>
                <td>{device.speaker}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Controls */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-game-controller"></i>
          Controls
        </h3>
        <table>
          <tbody>
            {device.dPad && (
              <tr>
                <th>D-Pad</th>
                <td>{device.dPad}</td>
              </tr>
            )}
            {device.analogs && (
              <tr>
                <th>Analog Sticks</th>
                <td>{device.analogs}</td>
              </tr>
            )}
            {device.faceButtons && (
              <tr>
                <th>Face Buttons</th>
                <td>{device.faceButtons}</td>
              </tr>
            )}
            {device.shoulderButtons && (
              <tr>
                <th>Shoulder Buttons</th>
                <td>{device.shoulderButtons}</td>
              </tr>
            )}
            {device.rumble && (
              <tr>
                <th>Rumble</th>
                <td>{device.rumble}</td>
              </tr>
            )}
            {device.sensors && (
              <tr>
                <th>Sensors</th>
                <td>{device.sensors}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Miscellaneous */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-gear"></i>
          Miscellaneous
        </h3>
        <table>
          <tbody>
            {device.colors && (
              <tr>
                <th>Colors</th>
                <td>{device.colors}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Connectivity */}
      <section class="specs-section overflow-auto">
        <h3>
          <i class="ph ph-wifi-high"></i>
          Connectivity
        </h3>
        <table>
          <tbody>
            {device.connectivity && (
              <>
                <tr>
                  <th>Wifi</th>
                  <td>{device.connectivity.hasWifi ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>Bluetooth</th>
                  <td>{device.connectivity.hasBluetooth ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>NFC</th>
                  <td>{device.connectivity.hasNFC ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>USB</th>
                  <td>{device.connectivity.hasUSB ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>HDMI</th>
                  <td>{device.connectivity.hasHDMI ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>DisplayPort</th>
                  <td>{device.connectivity.hasDisplayPort ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>VGA</th>
                  <td>{device.connectivity.hasVGA ? "✅" : "❌"}</td>
                </tr>
                <tr>
                  <th>DVI</th>
                  <td>{device.connectivity.hasDVI ? "✅" : "❌"}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
