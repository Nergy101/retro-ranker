export interface DeviceCpu {
  name?: string;
  names: string[];
  cores: number | null;
  frequency?: number;
  threads?: number | null;
  raw: string;
  clockSpeed?: {
    max: number;
    min?: number;
    unit: string;
  } | null;
}
