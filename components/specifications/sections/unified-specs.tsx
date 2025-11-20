import { Device } from "../../../data/frontend/contracts/device.model.ts";
import { UnifiedSpecsTable } from "../tables/unified-specs-table.tsx";

interface UnifiedSpecsProps {
  device: Device;
}

export function UnifiedSpecs({ device }: UnifiedSpecsProps) {
  return <UnifiedSpecsTable device={device} />;
}
