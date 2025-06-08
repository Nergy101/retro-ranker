import {
  DeviceArchitecture,
  DeviceBattery,
  DeviceBrand,
  DeviceChargePort,
  DeviceConnectivity,
  DeviceControlConfig,
  DeviceControls,
  Cooling,
  DeviceCpu,
  DeviceGpu,
  DeviceImage,
  Link,
  DeviceName,
  DeviceOs,
  DeviceOutputs,
  DevicePerformance,
  DevicePhysical,
  DevicePricing,
  DeviceRam,
  DeviceRelease,
  DeviceReviews,
  DeviceScreen,
  DeviceSensors,
  SystemRating,
  TagModel,
} from "@/models/mod.ts";

export interface Device {
  id: string; // the id of the device, this is the same as the name.sanitized
  name: DeviceName;
  brand: DeviceBrand;
  totalRating: number; // the total rating of the device, scale of 0-10
  image: DeviceImage;
  released: DeviceRelease;
  formFactor: string | null;
  os: DeviceOs;
  performance: DevicePerformance;
  systemRatings: SystemRating[];

  systemOnChip: string | null;
  architecture: DeviceArchitecture;

  cpus: DeviceCpu[] | null;
  gpus: DeviceGpu[] | null;
  ram: DeviceRam | null;
  battery: DeviceBattery;
  chargePort: DeviceChargePort | null;
  storage: string | null;

  screen: DeviceScreen;
  cooling: Cooling;
  controls: DeviceControls;
  connectivity: DeviceConnectivity;
  outputs: DeviceOutputs;
  rumble: boolean | null;
  sensors: DeviceSensors | null;
  lowBatteryIndicator: string | null;

  volumeControl: DeviceControlConfig["volumeControl"];
  brightnessControl: DeviceControlConfig["brightnessControl"];
  powerControl: DeviceControlConfig["powerControl"];

  dimensions: DevicePhysical["dimensions"];
  weight: DevicePhysical["weight"];
  shellMaterial: DevicePhysical["shellMaterial"];
  colors: string[];

  reviews: DeviceReviews;
  vendorLinks: Link[];
  hackingGuides: Link[];
  pricing: DevicePricing;

  pros: string[];
  cons: string[];
  notes: string[];
  tags: TagModel[];
}
