import { EmulationTier } from "../enums/EmulationTier.ts";

export interface Device {
  name: string;
  sanitizedName: string;
  imageUrl: string;
  brand: string;
  released: {
    raw: string;
    mentionedDate: Date | null;
  };
  formFactor: string;
  os: string;
  osIcons: string[];
  performanceRating: {
    tier: EmulationTier;
    rating: number;
    normalizedRating: number;
    maxEmulation: string;
  };
  systemRatings: {
    system: string;
    rating: string;
  }[];
  systemOnChip: string;
  cpu: string;
  cpuCores: number;
  cpuThreads: number;
  cpuClockSpeed: string;
  architecture: string;
  gpu: string;
  gpuCores: string;
  gpuClockSpeed: string;
  ram: string;
  screenSize: string;
  screenType: string;
  resolution: string;
  ppi: number;
  aspectRatio: string;
  screenLens: string;
  battery: string;
  cooling: string;
  dPad: string;
  analogs: string;
  faceButtons: string;
  shoulderButtons: string;
  extraButtons: string;
  chargePort: string;
  storage: string;
  connectivity: {
    hasWifi: boolean;
    hasBluetooth: boolean;
    hasNFC: boolean;
    hasUSB: boolean;
    hasHDMI: boolean;
    hasDisplayPort: boolean;
    hasVGA: boolean;
    hasDVI: boolean;
    hasHDMI: boolean;
  };
  videoOutput: string;
  audioOutput: string;
  speaker: string;
  rumble: string;
  sensors: string;
  volumeControl: string;
  brightnessControl: string;
  powerControl: string;
  dimensions: string;
  weight: string;
  shellMaterial: string;
  colors: string;
  videoReviews: string[];
  writtenReview: string;
  price: string;
  pricingCategory: string;
  vendorLinks: string[];
  pros: string[];
  cons: string[];
  emulationLimit: string;
  notes: string;
}

