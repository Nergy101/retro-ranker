export interface ClockSpeed {
  min: number | null;
  max: number | null;
  unit: "MHz" | "GHz" | null;
}

export interface DeviceCpu {
  raw: string | null;
  names: string[];
  cores: number | null;
  threads: number | null;
  clockSpeed: ClockSpeed | null;
}
