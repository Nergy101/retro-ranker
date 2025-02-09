import type { DeviceArchitecture } from "./models/architecture.model.ts";
import { DeviceBattery } from "./models/battery.model.ts";
import { DeviceChargePort } from "./models/charge-port.model.ts";
import { DeviceConnectivity } from "./models/connectivity.model.ts";
import { DeviceControlConfig } from "./models/controls-config.model.ts";
import { DeviceControls } from "./models/controls.model.ts";
import { Cooling } from "./models/cooling.model.ts";
import { DeviceCpu } from "./models/cpu.model.ts";
import { DeviceGpu } from "./models/gpu.model.ts";
import { DeviceImage } from "./models/image.model.ts";
import { Link } from "./models/Link.ts";
import { DeviceName } from "./models/name.model.ts";
import { DeviceOs } from "./models/os.model.ts";
import { DeviceOutputs } from "./models/outputs.model.ts";
import { DevicePerformance } from "./models/performance.model.ts";
import { DevicePhysical } from "./models/physical.model.ts";
import { DevicePricing } from "./models/pricing.model.ts";
import { DeviceRam } from "./models/ram.model.ts";
import { DeviceRelease } from "./models/release.model.ts";
import { DeviceReviews } from "./models/reviews.model.ts";
import { DeviceScreen } from "./models/screen.model.ts";
import { DeviceSensors } from "./models/sensors.model.ts";
import { SystemRating } from "./models/system-rating.model.ts";
import { Tag } from "./models/tag.model.ts";

export interface Device {
  name: DeviceName;
  brand: string;
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
  tags: Tag[];
}
