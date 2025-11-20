export interface DeviceReviews {
  count: number | null;
  average: number | null;
  videoReviews: Array<{
    url: string;
    name: string;
  }>;
  writtenReviews: Array<{
    url: string;
    name: string;
  }>;
}
