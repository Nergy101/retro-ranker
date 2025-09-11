export interface DevicePricing {
  category: string;
  average: number;
  currency: string;
  range: {
    min: number;
    max: number;
  };
  discontinued: boolean;
}
