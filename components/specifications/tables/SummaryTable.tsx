import { Device } from "../../../data/device.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

interface SummaryTableProps {
  device: Device;
}

export function SummaryTable({ device }: SummaryTableProps) {
  return (
    <table class="striped">
      <thead>
        <tr>
          <th>Category</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>OS / CFW</td>
          <td>
            {device.os.list.join(", ")}
            {device.os.customFirmwares.length > 0
              ? `(${device.os.customFirmwares.join(", ")})`
              : ""}
          </td>
        </tr>
        <tr>
          <td>SOC</td>
          <td>
            {device.systemOnChip} {device.architecture}
          </td>
        </tr>
        <tr>
          <td>CPU</td>
          <td>
            {device.cpus?.map((cpu, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.25rem",
                }}
              >
                {cpu.names.map((name, nameIndex) => (
                  <span key={nameIndex}>{name}</span>
                ))}
                {cpu.cores} cores ({cpu.threads} threads) @{" "}
                {cpu.clockSpeed?.max}
                {cpu.clockSpeed?.unit}
              </div>
            ))}
          </td>
        </tr>
        <tr>
          <td>GPU</td>
          <td>
            {device.gpus?.map((gpu, index) => (
              <div key={index}>
                {gpu.name} {gpu.cores} @ {gpu.clockSpeed?.max}
                {gpu.clockSpeed?.unit}
              </div>
            ))}
          </td>
        </tr>
        <tr>
          <td>RAM</td>
          <td>
            {device.ram?.type ??
              DeviceService.getPropertyIconByCharacter(null)}
            {device.ram?.sizes?.map((size, index) => (
              <span key={index}>
                {size}
                {device.ram?.unit}
                {index < (device.ram?.sizes?.length ?? 0) - 1 ? ", " : ""}
              </span>
            ))}
          </td>
        </tr>
        <tr>
          <td>Dimensions</td>
          <td>
            {device.dimensions
              ? `${device.dimensions.length}mm x ${device.dimensions.width}mm x ${device.dimensions.height}mm`
              : DeviceService.getPropertyIconByCharacter(null)}
            {device.weight} grams
          </td>
        </tr>
        <tr>
          <td>Screen</td>
          <td>
            {device.screen.size} {device.screen.type?.type}
            {device.screen.type?.isTouchscreen ? " (Touch)" : ""}
            {device.screen.type?.isPenCapable ? " (Pen)" : ""}
            {device.screen.resolution?.map((res) => (
              <div key={res.raw}>
                {res.width}x{res.height}
                {device.screen.ppi?.[0]
                  ? `, ${device.screen.ppi[0]} PPI`
                  : DeviceService.getPropertyIconByCharacter(null)}
              </div>
            ))}
          </td>
        </tr>
        <tr>
          <td>Battery</td>
          <td>
            {device.battery?.capacity
              ? device.battery?.capacity + " " +
                device.battery?.unit
              : DeviceService.getPropertyIconByCharacter(null)}
            Charge port: {device.chargePort?.type}{"  "}
            {device.chargePort?.numberOfPorts &&
                device.chargePort?.numberOfPorts > 1
              ? `${device.chargePort?.numberOfPorts}x`
              : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
