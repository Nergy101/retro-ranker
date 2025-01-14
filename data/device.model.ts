export interface Device {
  name: string;
  sanitizedName: string;
  imageUrl: string;
  brand: string;
  released: string;
  formFactor: string;
  os: string;
  osIcons: string[];
  performanceRating: {
    tier: EmulationTier;
    rating: number;
    normalizedRating: number;
    maxEmulation: string;
  };
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
  connectivity: string;
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

// Optional: Add an enum for common form factors
export enum FormFactor {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
  Clamshell = "Clamshell",
  Micro = "Micro"
}

// Optional: Add an enum for common operating systems
export enum OperatingSystem {
  Android = "Android",
  Windows = "Windows",
  Linux = "Linux",
  SteamOS = "Linux (Steam OS)",
  Custom = "Custom"
}

// Optional: Add a type for the performance rating scale
export type EmulationTier = 
  | "⭐️" // GB/GBC/GG/NES/SMS
  | "⭐️⭐️" // Most GBA & Genesis, some SNES
  | "⭐️⭐️⭐️" // Full GBA & Genesis, most SNES/PS1
  | "⭐️⭐️⭐️⭐️" // Full SNES/PS1, most DS, some N64/DC/PSP
  | "⭐️⭐️⭐️⭐️⭐️" // Most DS/N64/PSP/DC, some Saturn
  | "💥" // Full DS/N64/PSP/DC, most Saturn
  | "💥💥" // Full Saturn, some GameCube
  | "💥💥💥" // Most GameCube, some Wii/3DS
  | "💥💥💥💥" // Full GameCube, most Wii/3DS, some PS2/Wii U
  | "💥💥💥💥💥" // Full GameCube/Wii, most 3DS/PS2, some Wii U
  | "🔥" // Full 3DS/PS2, most Wii U, some Switch
  | "🔥🔥" // Most Switch, some PS3
  | "🔥🔥🔥" // Full Switch, most PS3
  | "🔥🔥🔥🔥" // Full PS3
  | "🔥🔥🔥🔥🔥"; // Beyond!

// Optional: Add a type for the spec ratings
export type SpecRating = "🔵" | "🟢" | "🟡" | "🟠" | "🔴"; 