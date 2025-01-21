import { EmulationTier } from "../enums/EmulationTier.ts";

export interface Device {
  name: {
    raw: string;
    sanitized: string;
  };
  brand: string;
  image: {
    originalUrl: string | null;
    url: string | null;
    alt: string | null;
  };
  released: {
    raw: string | null;
    mentionedDate: Date | null;
  };
  formFactor: string | null;
  os: {
    raw: string;
    list: string[];
    icons: string[]; // ph icon class names, can be used with deviceService.getOsIconComponent or <i class={icon} />
    customFirmwares: string[];
  };
  performance: {
    tier: EmulationTier | null;
    rating: number | null; // 0-15
    normalizedRating: number | null; // 0-10

    // samey?
    maxEmulation: string | null;
    emulationLimit: string | null;
  };
  consoleRatings: {
    system: string; // console name
    rating: string; // A-F
  }[];

  systemOnChip: string | null;
  architecture: string | null;

  // CPU
  cpu: {
    raw: string | null;
    names: string[];
    cores: number | null;
    threads: number | null;
    clockSpeed: string | null;
  };

  // GPU
  gpu: {
    name: string | null;
    cores: string | null;
    clockSpeed: string | null;
  };

  ram: string | null;
  battery: string | null;
  chargePort: string | null;
  storage: string | null;

  // Screen
  screen: {
    size: string | null;
    type: string | null;
    resolution: string | null;
    ppi: number | null;
    aspectRatio: string | null;
    lens: string | null;
  };

  cooling: {
    raw: string | null;
    hasHeatsink: boolean | null;
    hasHeatPipe: boolean | null;
    hasFan: boolean | null;
    hasVentilationCutouts: boolean | null;
  };

  // Controls
  controls: {
    dPad: string | null;
    analogs: string[];
    faceButtons: string[];
    shoulderButtons: string[];
    extraButtons: string[];
  };

  connectivity: {
    hasWifi: boolean | null;
    hasBluetooth: boolean | null;
    hasNFC: boolean | null;
    hasUSB: boolean | null;
    hasUSBC: boolean | null;
    hasHDMI: boolean | null;
    hasDisplayPort: boolean | null;
    hasVGA: boolean | null;
    hasDVI: boolean | null;
  };

  // Outputs
  outputs: {
    videoOutput: string | null;
    audioOutput: string | null;
    speaker: string | null;
  };

  rumble: string | null;
  sensors: string[];
  lowBatteryIndicator: string | null;

  volumeControl: string | null;
  brightnessControl: string | null;
  powerControl: string | null;

  dimensions: string | null;
  weight: string | null;
  shellMaterial: string | null;
  colors: string[];

  // Reviews
  reviews: {
    videoReviews: {
      url: string;
      name: string;
    }[];
    writtenReviews: {
      url: string;
      name: string;
    }[];
  };

  pricing: {
    raw: string | null;
    discontinued: boolean | null;
    average: number | null;
    range: {
      min: number | null;
      max: number | null;
    };
    currency: string | null;
    category: string | null; // budget, mid, high
  };

  pros: string[];
  cons: string[];

  vendorLinks: {
    url: string;
    name: string;
  }[];
  hackingGuides: {
    url: string;
    name: string;
  }[];
  notes: string[];
}
