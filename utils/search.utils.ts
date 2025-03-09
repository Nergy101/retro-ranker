import { Device } from "../data/device.model.ts";

export const searchDevices = (query: string, devices: Device[]) => {
  return devices.filter((device) =>
    device.name.raw.toLowerCase().includes(query.trim().toLowerCase()) ||
    device.brand.raw.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => a.name.raw.localeCompare(b.name.raw))
    .sort((a, b) => {
      const dateA = a.released.mentionedDate
        ? new Date(a.released.mentionedDate).getTime()
        : 0;
      const dateB = b.released.mentionedDate
        ? new Date(b.released.mentionedDate).getTime()
        : 0;
      return dateB - dateA;
    });
};
