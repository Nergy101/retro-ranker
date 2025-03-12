export interface DeviceBattery {
  raw: string | null;
  capacity: number | null;
  unit: "mAh" | "Wh" | null;
}
