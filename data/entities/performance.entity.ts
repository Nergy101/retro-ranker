export interface Performance {
  id: string;
  device: string;

  tier: string | null;
  rating: number | null;
  normalizedRating: number | null;
  maxEmulation: string | null;
  emulationLimit: string | null;
}
