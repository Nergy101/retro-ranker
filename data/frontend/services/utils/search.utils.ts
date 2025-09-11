import { Device } from "../../contracts/device.model.ts";

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

export const getNewestDevices = (
  devices: Device[],
  count: number = 6,
): Device[] => {
  return devices
    .filter((device) => device.released.mentionedDate) // Only devices with release dates
    .sort((a, b) => {
      const dateA = a.released.mentionedDate
        ? new Date(a.released.mentionedDate).getTime()
        : 0;
      const dateB = b.released.mentionedDate
        ? new Date(b.released.mentionedDate).getTime()
        : 0;
      return dateB - dateA; // Newest first
    })
    .slice(0, count);
};
