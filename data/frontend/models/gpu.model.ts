export interface DeviceGpu {
  name: string;
  frequency?: number;
  cores?: number | null;
  clockSpeed?: {
    max: number;
    min?: number;
    unit: string;
  } | null;
}
