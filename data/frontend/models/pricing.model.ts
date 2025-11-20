export interface DevicePricing {
  category: string | null;
  average: number | null;
  currency: string | null;
  range: {
    min: number | null;
    max: number | null;
  } | null;
  discontinued: boolean | null;
  raw: string | null;
}
