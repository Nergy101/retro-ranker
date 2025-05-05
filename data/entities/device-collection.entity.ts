import { Device } from "../frontend/contracts/device.model.ts";
import { BaseEntity } from "./base.entity.ts";

export interface DeviceCollection extends BaseEntity {
  name: string;

  description: string;

  devices: Device[];
  deviceCount: number;
}
