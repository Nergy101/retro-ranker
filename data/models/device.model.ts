import { EmulationTier } from "../enums/EmulationTier.ts";

export interface Device {
  name: {
    raw: string;
    sanitized: string;
  };
  brand: string;
  image: {
    originalUrl: string;
    url: string | null;
    alt: string | null;
  };
  released: {
    raw: string;
    mentionedDate: Date | null;
  };
  formFactor: string;
  os: {
    raw: string;
    list: string[];
    icons: string[]; // ph icon class names, can be used with deviceService.getOsIconComponent or <i class={icon} />
  };
  performance: {
    tier: EmulationTier;
    rating: number; // 0-15
    normalizedRating: number; // 0-10

    // samey?
    maxEmulation: string;
    emulationLimit: string;
  };
  consoleRatings: {
    system: string; // console name
    rating: string; // A-F
  }[];

  systemOnChip: string;
  architecture: string;

  // CPU
  cpu: {
    name: string;
    cores: number;
    threads: number;
    clockSpeed: string;
  };

  // GPU
  gpu: {
    name: string;
    cores: string;
    clockSpeed: string;
  };

  ram: string;
  battery: string;
  chargePort: string;
  storage: string;

  // Screen
  screen: {
    size: string;
    type: string;
    resolution: string;
    ppi: number;
    aspectRatio: string;
    lens: string;
  };

  cooling: {
    raw: string;
    hasHeatsink: boolean;
    hasHeatPipe: boolean;
    hasFan: boolean;
    hasVentilationCutouts: boolean;
  };

  // Controls
  controls: {
    dPad: string;
    analogs: string;
    faceButtons: string;
    shoulderButtons: string;
    extraButtons: string;
  };

  connectivity: {
    hasWifi: boolean;
    hasBluetooth: boolean;
    hasNFC: boolean;
    hasUSB: boolean;
    hasHDMI: boolean;
    hasDisplayPort: boolean;
    hasVGA: boolean;
    hasDVI: boolean;
  };

  // Outputs
  outputs: {
    videoOutput: string;
    audioOutput: string;
    speaker: string;
  };

  rumble: string;
  sensors: string;

  volumeControl: string;
  brightnessControl: string;
  powerControl: string;

  dimensions: string;
  weight: string;
  shellMaterial: string;
  colors: string[];

  // Reviews
  reviews: {
    videoReviews: string[];
    writtenReview: string;
  };

  pricing: {
    raw: string;
    average: number;
    range: {
      min: number;
      max: number;
    };
    currency: string;
    category: string; // budget, mid, high
  };

  pros: string[];
  cons: string[];

  vendorLinks: string[];
  notes: string[];
}
