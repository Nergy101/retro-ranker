import { Device } from "../../../data/models/device.model.ts";

interface ProcessingSpecsTableProps {
  device: Device;
}

export function ProcessingSpecsTable({ device }: ProcessingSpecsTableProps) {
  return (
    <table class="striped">
      <tbody>
        {device.systemOnChip && (
          <tr>
            <th>System on Chip</th>
            <td>{device.systemOnChip}</td>
          </tr>
        )}
        {device.cpus && device.cpus.map((cpu, index) => (
          <tr key={index}>
            <th>{device.cpus!.length > 1 ? `CPU ${index + 1}` : "CPU"}</th>
            <td>
              {cpu.names.join(", ")}
              {cpu.cores && cpu.cores > 0 && ` (${cpu.cores} cores)`}
              {cpu.clockSpeed && (
                ` @ ${cpu.clockSpeed.max}${cpu.clockSpeed.unit}`
              )}
            </td>
          </tr>
        ))}
        {device.gpus && device.gpus.map((gpu, index) => (
          <tr key={index}>
            <th>{device.gpus!.length > 1 ? `GPU ${index + 1}` : "GPU"}</th>
            <td>
              {gpu.name}
              {gpu.cores && ` (${gpu.cores})`}
              {gpu.clockSpeed && (
                ` @ ${gpu.clockSpeed.max}${gpu.clockSpeed.unit}`
              )}
            </td>
          </tr>
        ))}
        {device.ram && (
          <tr>
            <th>RAM</th>
            <td>
              {device.ram.raw ||
                (device.ram.sizes && device.ram.unit?.toUpperCase() &&
                  `${device.ram.sizes.join("/")}${device.ram.unit}`)}
              {device.ram.type && ` ${device.ram.type.toUpperCase()}`}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
