import { EmulationTier } from "../enums/EmulationTier.ts";

export interface DevicePerformance {
  tier: EmulationTier | null;
  rating: number | null;
  normalizedRating: number | null;
  maxEmulation: string | null;
  emulationLimit: string | null;
}
