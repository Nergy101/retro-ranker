import { Device } from "../data/device.model.ts";

interface DeviceSpecsProps {
  device: Device;
}

export function DeviceSpecs({ device }: DeviceSpecsProps) {
  return (
    <div class="specs-grid">
      {/* Processing */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-cpu"></i>
          Processing
        </h3>
        <dl>
          {device.systemOnChip && (
            <>
              <dt>System on Chip</dt>
              <dd>{device.systemOnChip}</dd>
            </>
          )}
          {device.cpu && (
            <>
              <dt>CPU</dt>
              <dd>
                {device.cpu}
                {device.cpuCores > 0 && ` (${device.cpuCores} cores)`}
                {device.cpuClockSpeed && ` @ ${device.cpuClockSpeed}`}
              </dd>
            </>
          )}
          {device.gpu && (
            <>
              <dt>GPU</dt>
              <dd>
                {device.gpu}
                {device.gpuCores && ` (${device.gpuCores})`}
                {device.gpuClockSpeed && ` @ ${device.gpuClockSpeed}`}
              </dd>
            </>
          )}
          {device.ram && (
            <>
              <dt>RAM</dt>
              <dd>{device.ram}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Display */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-monitor"></i>
          Display
        </h3>
        <dl>
          {device.screenSize && (
            <>
              <dt>Screen Size</dt>
              <dd>{device.screenSize}</dd>
            </>
          )}
          {device.screenType && (
            <>
              <dt>Panel Type</dt>
              <dd>{device.screenType}</dd>
            </>
          )}
          {device.resolution && (
            <>
              <dt>Resolution</dt>
              <dd>{device.resolution}</dd>
            </>
          )}
          {device.aspectRatio && (
            <>
              <dt>Aspect Ratio</dt>
              <dd>{device.aspectRatio}</dd>
            </>
          )}
          {device.ppi && (
            <>
              <dt>PPI</dt>
              <dd>{device.ppi}</dd>
            </>
          )}
          {device.videoOutput && (
            <>
              <dt>Video Output</dt>
              <dd>{device.videoOutput}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Physical */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-ruler"></i>
          Physical
        </h3>
        <dl>
          {device.dimensions && (
            <>
              <dt>Dimensions</dt>
              <dd>{device.dimensions}</dd>
            </>
          )}
          {device.weight && (
            <>
              <dt>Weight</dt>
              <dd>{device.weight}</dd>
            </>
          )}
          {device.battery && (
            <>
              <dt>Battery</dt>
              <dd>{device.battery}</dd>
            </>
          )}
          {device.cooling && (
            <>
              <dt>Cooling</dt>
              <dd>{device.cooling}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Audio and Video */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-speaker-high"></i>
          Audio
        </h3>
        <dl>
          {device.audioOutput && (
            <>
              <dt>Audio Output</dt>
              <dd>{device.audioOutput}</dd>
            </>
          )}
          {device.speaker && (
            <>
              <dt>Speakers</dt>
              <dd>{device.speaker}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Controls */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-game-controller"></i>
          Controls
        </h3>
        <dl>
          {device.dPad && (
            <>
              <dt>D-Pad</dt>
              <dd>{device.dPad}</dd>
            </>
          )}
          {device.analogs && (
            <>
              <dt>Analog Sticks</dt>
              <dd>{device.analogs}</dd>
            </>
          )}
          {device.faceButtons && (
            <>
              <dt>Face Buttons</dt>
              <dd>{device.faceButtons}</dd>
            </>
          )}
          {device.shoulderButtons && (
            <>
              <dt>Shoulder Buttons</dt>
              <dd>{device.shoulderButtons}</dd>
            </>
          )}
          {device.rumble && (
            <>
              <dt>Rumble</dt>
              <dd>{device.rumble}</dd>
            </>
          )}
          {device.sensors && (
            <>
              <dt>Sensors</dt>
              <dd>{device.sensors}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Miscellaneous */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-gear"></i>
          Miscellaneous
        </h3>
        <dl>
          {device.colors && (
            <>
              <dt>Colors</dt>
              <dd>{device.colors}</dd>
            </>
          )}
        </dl>
      </section>

      {/* Connectivity */}
      <section class="specs-section">
        <h3 style={{ fontSize: "1.25rem", color: "var(--pico-contrast)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i class="ph ph-wifi-high"></i>
          Connectivity
        </h3>
        <dl>
          {device.connectivity && (
            <>
              <dt>Wifi</dt>
              <dd>{device.connectivity.hasWifi ? "✅" : "❌"}</dd>
              <dt>Bluetooth</dt>
              <dd>{device.connectivity.hasBluetooth ? "✅" : "❌"}</dd>
              <dt>NFC</dt>
              <dd>{device.connectivity.hasNFC ? "✅" : "❌"}</dd>
              <dt>USB</dt>
              <dd>{device.connectivity.hasUSB ? "✅" : "❌"}</dd>
              <dt>HDMI</dt>
              <dd>{device.connectivity.hasHDMI ? "✅" : "❌"}</dd>
              <dt>DisplayPort</dt>
              <dd>{device.connectivity.hasDisplayPort ? "✅" : "❌"}</dd>
              <dt>VGA</dt>
              <dd>{device.connectivity.hasVGA ? "✅" : "❌"}</dd>
              <dt>DVI</dt>
              <dd>{device.connectivity.hasDVI ? "✅" : "❌"}</dd>
            </>
          )}
        </dl>
      </section>
    </div>
  );
}
