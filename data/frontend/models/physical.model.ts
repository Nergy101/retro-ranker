export interface DeviceDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface ShellMaterial {
  raw: string | null;
  isPlastic: boolean | null;
  isMetal: boolean | null;
  isAluminum: boolean | null;
  isMagnesiumAlloy: boolean | null;
  isOther: boolean | null;
}

export interface DevicePhysical {
  dimensions: DeviceDimensions | null;
  weight: number | null;
  shellMaterial: ShellMaterial | null;
  colors: string[];
}
