import { Device } from "./device.model.ts";

export interface DeviceCollection {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  devices: Device[];
  description: string;
}
