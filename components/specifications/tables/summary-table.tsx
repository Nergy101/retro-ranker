import { Device } from "@data/frontend/contracts/device.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import {
  PiBatteryFull,
  PiBracketsSquare,
  PiCircuitry,
  PiCpu,
  PiGraphicsCard,
  PiMonitor,
  PiRuler,
  PiSquaresFour,
} from "@preact-icons/pi";

interface SummaryTableProps {
  device: Device;
}

export function SummaryTable({ device }: SummaryTableProps) {
  return (
    <div class="summary-table-container">
      <table class="summary-table">
        <thead>
          <tr>
            <th>
              Category
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="category-cell">
              <PiSquaresFour />
              OS / CFW
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.os.list.join(", ")}
                {device.os.customFirmwares.length > 0 && (
                  <span class="cfw-info">
                    ({device.os.customFirmwares.join(", ")})
                  </span>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiCircuitry />
              SOC
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.systemOnChip} {device.architecture}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiCpu />
              CPU
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.cpus?.map((cpu, index) => (
                  <div key={index} class="cpu-item">
                    <div class="cpu-names">
                      {cpu.names.join(", ")}
                    </div>
                    <div class="cpu-specs">
                      {cpu.cores} cores ({cpu.threads} threads) @{" "}
                      {cpu.clockSpeed?.max}
                      {cpu.clockSpeed?.unit}
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiGraphicsCard />
              GPU
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.gpus?.map((gpu, index) => (
                  <div key={index} class="gpu-item">
                    <span class="gpu-name">{gpu.name}</span>
                    <br />
                    {gpu.cores && <span class="gpu-cores">{gpu.cores}</span>}

                    {gpu.clockSpeed && (
                      <span class="gpu-clock">
                        @ {gpu.clockSpeed.max} {gpu.clockSpeed.unit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiBracketsSquare />
              RAM
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.ram?.type ??
                  DeviceService.getPropertyIconByCharacter(null)}
                {device.ram?.sizes?.map((size, index) => (
                  <span key={index} class="ram-size">
                    {size}
                    {device.ram?.unit}
                    {index < (device.ram?.sizes?.length ?? 0) - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiRuler />
              Dimensions
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.dimensions
                  ? `${device.dimensions.length}mm x ${device.dimensions.width}mm x ${device.dimensions.height}mm`
                  : DeviceService.getPropertyIconByCharacter(null)}
                {device.weight && (
                  <>
                    <br />
                    <span class="weight-info">{device.weight} grams</span>
                  </>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiMonitor />
              Screen
            </td>
            <td class="details-cell">
              <div class="detail-content">
                <div class="screen-basic">
                  {device.screen.size} {device.screen.type?.type}{" "}
                  {device.screen.type?.isTouchscreen && (
                    <span class="screen-feature">(Touch)</span>
                  )}
                  {device.screen.type?.isPenCapable && (
                    <span class="screen-feature">(Pen)</span>
                  )}
                </div>
                {device.screen.resolution?.map((res) => (
                  <div key={res.raw} class="screen-resolution">
                    {res.width}x{res.height}
                    {device.screen.ppi?.[0]
                      ? `, ${device.screen.ppi[0]} PPI`
                      : DeviceService.getPropertyIconByCharacter(null)}
                  </div>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiBatteryFull />
              Battery
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.battery?.capacity
                  ? (
                    <span class="battery-capacity">
                      {device.battery?.capacity} {device.battery?.unit}
                    </span>
                  )
                  : DeviceService.getPropertyIconByCharacter(null)}
                {device.chargePort?.type && (
                  <div class="charge-port-info">
                    Charge port: {device.chargePort?.type}
                    {device.chargePort?.numberOfPorts &&
                        device.chargePort?.numberOfPorts > 1
                      ? ` (${device.chargePort?.numberOfPorts}x)`
                      : ""}
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <style>
        {`
        .summary-table-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--pico-secondary);
        }
        
        .summary-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .summary-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
          border-bottom: 2px solid var(--pico-primary-hover);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .summary-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--pico-muted-border-color);
          vertical-align: top;
        }
        
        .summary-table tr:last-child td {
          border-bottom: none;
        }
        
        .category-cell {
          font-weight: 600;
          min-width: 140px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .details-cell {
          color: var(--pico-color);
        }
        
        .detail-content {
          line-height: 1.5;
        }
        
        .cfw-info {
          color: var(--pico-muted-color);
          font-style: italic;
          margin-left: 0.5rem;
        }
        
        .cpu-item {
          margin-bottom: 0.75rem;
        }
        
        .cpu-item:last-child {
          margin-bottom: 0;
        }
        
        .cpu-names {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .cpu-specs {
          color: var(--pico-muted-color);
          font-size: 0.9rem;
        }
        
        .gpu-item {
          margin-bottom: 0.5rem;
        }
        
        .gpu-item:last-child {
          margin-bottom: 0;
        }
        
        .gpu-name {
          font-weight: 500;
        }
        
        .gpu-cores {
          color: var(--pico-muted-color);
        }
        
        .gpu-clock {
          color: var(--pico-muted-color);
          font-size: 0.9rem;
        }
        
        .ram-size {
          color: var(--pico-color);
        }
        
        .weight-info {
          color: var(--pico-muted-color);
          font-size: 0.9rem;
        }
        
        .screen-basic {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .screen-feature {
          color: var(--pico-muted-color);
          font-size: 0.875rem;
        }
        
        .screen-resolution {
          color: var(--pico-color);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .battery-capacity {
          font-weight: 500;
        }
        
        .charge-port-info {
          margin-top: 0.5rem;
          color: var(--pico-muted-color);
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .summary-table th,
          .summary-table td {
            padding: 0.75rem;
          }
          
          .category-cell {
            min-width: 120px;
          }
        }
      `}
      </style>
    </div>
  );
}
