import { Device } from "../../contracts/device.model.ts";

export const searchDevices = (query: string, devices: Device[]) => {
  return devices.filter((device) =>
    device.name.raw.toLowerCase().includes(query.trim().toLowerCase()) ||
    device.brand.raw.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => a.name.raw.localeCompare(b.name.raw))
    .sort((a, b) => {
      // Check if devices are upcoming
      const aIsUpcoming = a.released.raw?.toLowerCase().includes("upcoming") ??
        false;
      const bIsUpcoming = b.released.raw?.toLowerCase().includes("upcoming") ??
        false;

      // Upcoming devices always come first
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      // For non-upcoming devices or both upcoming, sort by date
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
