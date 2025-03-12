import { ClockSpeed } from "./cpu.model.ts";

export interface DeviceGpu {
  name: string | null;
  cores: string | null;
  clockSpeed: ClockSpeed | null;
}
