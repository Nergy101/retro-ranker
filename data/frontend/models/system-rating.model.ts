import { EmulationSystem } from "../enums/emulation-system.ts";

export interface SystemRating {
  system: EmulationSystem;
  ratingMark: string;
  ratingNumber: number | null;
}
