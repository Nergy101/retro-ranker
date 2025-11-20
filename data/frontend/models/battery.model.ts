export interface DeviceBattery {
  capacity: number | null;
  unit: string | null;
  type: string;
  removable: boolean;
  charging: string;
  raw: string | null;
}
