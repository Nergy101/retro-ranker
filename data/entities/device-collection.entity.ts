import { BaseEntity } from "./base.entity.ts";
import { Device } from "./device.entity.ts";

export interface DeviceCollection extends BaseEntity {
  name: string;

  description: string;

  devices: Device[];
  deviceCount: number;
}
