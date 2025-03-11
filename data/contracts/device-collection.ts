import { Device } from "../device.model.ts";

export interface DeviceCollection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  devices: Device[];
  deviceCount: number;
}
