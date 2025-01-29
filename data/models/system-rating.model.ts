import { EmulationSystem } from "../enums/EmulationSystem.ts";

export interface SystemRating {
  system: EmulationSystem;
  ratingMark: string;
  ratingNumber: number | null;
}
