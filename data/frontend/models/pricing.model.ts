export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface DevicePricing {
  raw: string | null;
  discontinued: boolean | null;
  average: number | null;
  range: PriceRange;
  currency: string | null;
  category: "low" | "mid" | "high" | null;
}
