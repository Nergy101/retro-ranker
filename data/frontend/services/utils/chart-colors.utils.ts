/**
 * Utility functions for generating consistent colors for charts and UI elements
 */

/**
 * Generate a color for a device at a specific index, matching the radar chart colors
 * @param index The index of the device (0-based)
 * @returns HSL color string
 */
export function generateDeviceColor(index: number): string {
  // Generate a distinct color for the device using the same logic as the radar chart
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Generate colors for a list of devices, with the first device being the main device
 * @param devices Array of devices
 * @returns Object mapping device names to their colors
 */
export function generateDeviceColors(
  devices: Array<{ name: { sanitized: string } }>,
): Record<string, string> {
  const colors: Record<string, string> = {};

  devices.forEach((device, index) => {
    colors[device.name.sanitized] = generateDeviceColor(index);
  });

  return colors;
}
