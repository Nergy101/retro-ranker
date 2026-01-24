import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { DeviceService as _DeviceService } from "../../../data/frontend/services/devices/device.service.ts";
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
    <>
      <style>
        {`
        /* Header rows - lightest background, ensure it overrides all other rules */
        /* Use a unique class to avoid conflicts */
        table.striped.summary-table thead th,
        table.striped.summary-table thead tr th,
        table.striped.summary-table thead tr:nth-child(odd) th,
        table.striped.summary-table thead tr:nth-child(even) th,
        table.striped.summary-table thead th.subheader {
          background-color: var(--pico-card-background-color) !important;
          color: var(--pico-primary) !important;
          border-bottom: 2px solid var(--pico-primary-hover) !important;
          font-weight: 600 !important;
        }
        
        /* Body rows - ensure proper alternating */
        table.striped.summary-table tbody tr:nth-child(even) td {
          background-color: var(--pico-background-color) !important;
        }
        
        table.striped.summary-table tbody tr:nth-child(odd) td {
          background-color: var(--pico-table-row-stripped-background-color) !important;
        }
        
        .category-cell {
          font-weight: 600;
          min-width: 140px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .cfw-info {
          color: var(--pico-muted-color);
          font-style: italic;
          margin-left: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .category-cell {
            min-width: 120px;
          }
        }
      `}
      </style>

      <table class="striped summary-table">
        <tbody>
          <tr>
            <td class="category-cell">
              <PiSquaresFour />
              OS / CFW
            </td>
            <td>
              {device.os.list.join(", ")}
              {device.os.customFirmwares.length > 0 && (
                <span class="cfw-info">
                  ({device.os.customFirmwares.join(", ")})
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiCircuitry />
              SOC
            </td>
            <td>
              {device.cpus?.[0]?.names.join(", ") || "Unknown"}
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiCpu />
              CPU
            </td>
            <td>
              {device.cpus?.[0]?.cores || "Unknown"} cores @{" "}
              {device.cpus?.[0]?.clockSpeed?.max || "Unknown"}{" "}
              {device.cpus?.[0]?.clockSpeed?.unit || "Unknown"}
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiGraphicsCard />
              GPU
            </td>
            <td>
              {device.gpus?.[0]?.name || "Unknown"}
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiBracketsSquare />
              RAM
            </td>
            <td>
              {device.ram?.sizes?.join(", ") || "Unknown"}{" "}
              {device.ram?.unit || ""}
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiMonitor />
              Display
            </td>
            <td>
              {device.screen?.size || "Unknown"}" {device.screen?.resolution &&
                  device.screen.resolution.length > 0
                ? device.screen.resolution.map((res) =>
                  `${res.width}x${res.height}`
                ).join(", ")
                : "Unknown"} ({device.screen?.type?.type || "Unknown"})
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiBatteryFull />
              Battery
            </td>
            <td>
              {device.battery?.capacity || "Unknown"}{" "}
              {device.battery?.unit || ""} ({device.battery?.type || "Unknown"})
            </td>
          </tr>
          <tr>
            <td class="category-cell">
              <PiRuler />
              Dimensions
            </td>
            <td>
              {device.dimensions
                ? `${device.dimensions.length}x${device.dimensions.width}x${device.dimensions.height}`
                : "Unknown"}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
