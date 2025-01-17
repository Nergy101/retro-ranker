import { Device } from "../data/models/device.model.ts";

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
                  {device.cpu.name}
                  {device.cpu.cores > 0 && ` (${device.cpu.cores} cores)`}
                  {device.cpu.clockSpeed && ` @ ${device.cpu.clockSpeed}`}
                </td>
              </tr>
            )}
            {device.gpu && (
              <tr>
                <th>GPU</th>
                <td>
                  {device.gpu.name}
                  {device.gpu.cores && ` (${device.gpu.cores})`}
                  {device.gpu.clockSpeed && ` @ ${device.gpu.clockSpeed}`}
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
            {device.screen.size && (
              <tr>
                <th>Screen Size</th>
                <td>{device.screen.size}</td>
              </tr>
            )}
            {device.screen.type && (
              <tr>
                <th>Panel Type</th>
                <td>{device.screen.type}</td>
              </tr>
            )}
            {device.screen.resolution && (
              <tr>
                <th>Resolution</th>
                <td>{device.screen.resolution}</td>
              </tr>
            )}
            {device.screen.aspectRatio && (
              <tr>
                <th>Aspect Ratio</th>
                <td>{device.screen.aspectRatio}</td>
              </tr>
            )}
            {device.screen.ppi && (
              <tr>
                <th>PPI</th>
                <td>{device.screen.ppi}</td>
              </tr>
            )}
            {device.outputs.videoOutput && (
              <tr>
                <th>Video Output</th>
                <td>{device.outputs.videoOutput}</td>
              </tr>
            )}
            {device.outputs.audioOutput && (
              <tr>
                <th>Audio Output</th>
                <td>{device.outputs.audioOutput}</td>
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
            {device.outputs.audioOutput && (
              <tr>
                <th>Audio Output</th>
                <td>{device.outputs.audioOutput}</td>
              </tr>
            )}
            {device.outputs.speaker && (
              <tr>
                <th>Speakers</th>
                <td>{device.outputs.speaker}</td>
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
            {device.controls.dPad && (
              <tr>
                <th>D-Pad</th>
                <td>{device.controls.dPad}</td>
              </tr>
            )}
            {device.controls.analogSticks && (
              <tr>
                <th>Analog Sticks</th>
                <td>{device.controls.analogSticks}</td>
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
            {device.controls.rumble && (
              <tr>
                <th>Rumble</th>
                <td>{device.controls.rumble}</td>
              </tr>
            )}
            {device.controls.sensors && (
              <tr>
                <th>Sensors</th>
                <td>{device.controls.sensors}</td>
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
                <td>{device.colors.join(", ")}</td>
              </tr>
            )}
            {device.notes && (
              <tr>
                <th>Notes</th>
                <td>{device.notes.join(", ")}</td>
              </tr>
            )}
            {device.performance.emulationLimit && (
              <tr>
                <th>Emulation Limit</th>
                <td>{device.performance.emulationLimit}</td>
              </tr>
            )}
            {device.performance.maxEmulation && (
              <tr>
                <th>Max Emulation</th>
                <td>{device.performance.maxEmulation}</td>
              </tr>
            )}
            {device.reviews.writtenReview && (
              <tr>
                <th>Written Review</th>
                <td>{device.reviews.writtenReview}</td>
              </tr>
            )}
            {device.reviews.videoReviews && (
              <tr>
                <th>Video Reviews</th>
                <td>{device.reviews.videoReviews.join(", ")}</td>
              </tr>
            )}
            {device.pros && (
              <tr>
                <th>Pros</th>
                <td>{device.pros}</td>
              </tr>
            )}
            {device.cons && (
              <tr>
                <th>Cons</th>
                <td>{device.cons}</td>
              </tr>
            )}
            {device.vendorLinks && (
              <tr>
                <th>Vendor Links</th>
                <td>{device.vendorLinks.join(", ")}</td>
              </tr>
            )}
            {device.shellMaterial && (
              <tr>
                <th>Shell Material</th>
                <td>{device.shellMaterial}</td>
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
