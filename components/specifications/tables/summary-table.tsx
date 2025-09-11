import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../../../data/frontend/services/devices/device.service.ts";
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
                {device.cpus?.[0]?.name || "Unknown"}
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
                {device.cpus?.[0]?.cores || "Unknown"} cores @{" "}
                {device.cpus?.[0]?.frequency || "Unknown"}
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
                {device.gpus?.[0]?.name || "Unknown"}
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
                {device.ram?.sizes?.join(", ") || "Unknown"}{" "}
                {device.ram?.unit || ""}
              </div>
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiMonitor />
              Display
            </td>
            <td class="details-cell">
              <div class="detail-content">
                {device.screen?.size || "Unknown"}"{" "}
                {device.screen?.resolution || "Unknown"}{" "}
                ({device.screen?.type || "Unknown"})
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
                {device.battery?.capacity || "Unknown"}{" "}
                {device.battery?.unit || ""}{" "}
                ({device.battery?.type || "Unknown"})
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
                  ? `${device.dimensions.length}x${device.dimensions.width}x${device.dimensions.height}`
                  : "Unknown"}
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
          background: var(--pico-card-background-color);
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
