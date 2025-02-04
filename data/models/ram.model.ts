export interface DeviceRam {
  raw: string | null;
  sizes: number[] | null;
  unit: "GB" | "MB" | "KB" | null;
  type:
    | "DDR"
    | "DDR2"
    | "DDR3"
    | "DDR4"
    | "DDR5"
    | "LPDDR4"
    | "LPDDR4X"
    | "LPDDR5"
    | "LPDDR5X"
    | "other"
    | null;
}
