import { BaseEntity } from "./base.entity.ts";
import { Pricing } from "./pricing.entity.ts";
import { SystemRating } from "./system-rating.entity.ts";
import { TagModel } from "./tag.entity.ts";
import { Performance } from "./performance.entity.ts";
export interface DeviceEntity extends BaseEntity {
  // the id of the device is the same as the name.sanitized
  nameRaw: string;
  nameSanitized: string;

  brandRaw: string;
  brandSanitized: string;

  released?: Date;

  totalRating: number; // the total rating of the device, scale of 0-10

  deviceType: "handheld" | "oem"; // track the type of device

  index: number; // the index/order of the device in the source data

  pricing: Pricing;
  performance: Performance;
  systemRatings: SystemRating[];

  deviceData: DeviceJson;

  tags: TagModel[];
}

export type DeviceJson = string;
