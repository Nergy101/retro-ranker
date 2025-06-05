import { Device } from "../../contracts/device.model.ts";

export class ScoreCalculatorService {
  static calculateScore(device: Device): number {
    // Use the device's performance rating (assumed to be between 0 and 10)
    const performanceScore = device.performance?.normalizedRating ?? 1;

    // Define individual binary features – each feature is worth up to 10 points.
    // You can adjust these checks or add more features as required.
    const features = {
      // Display features
      hasHDScreen: device.screen.ppi?.[0] && device.screen.ppi[0] >= 200
        ? 10
        : 0,
      hasGoodScreenSize: device.screen.size && device.screen.size >= 5 ? 10 : 0,
      hasQualityPanel: (device.screen.type?.type === "IPS" ||
          device.screen.type?.type === "OLED" ||
          device.screen.type?.type === "AMOLED")
        ? 10
        : 0,

      // Performance-related
      hasGoodCPU: device.cpus?.[0]?.cores && device.cpus[0].cores >= 4 ? 10 : 0,
      hasGoodRAM: device.ram?.sizes?.[0] && device.ram.sizes[0] >= 4 ? 10 : 0,
      hasGoodCooling: device.cooling.raw?.toLowerCase().includes("fan")
        ? 10
        : 0,

      // Connectivity features
      hasWifi: device.connectivity.hasWifi ? 10 : 0,
      hasBluetooth: device.connectivity.hasBluetooth ? 10 : 0,
      hasHDMI: device.outputs.videoOutput?.hasHdmi ? 10 : 0,

      // Controls
      hasAnalogs: device.controls.analogs?.dual ? 10 : 0,
      hasGoodButtons: device.controls.shoulderButtons?.L2 ? 10 : 0,

      // Extra features
      // Check for a reasonably good battery (e.g., 3000 mAh or more)
      hasGoodBattery:
        device.battery?.capacity && device.battery.capacity >= 3000 ? 10 : 0,
      // Check the build quality based on the material (metal or aluminum is preferred)
      hasGoodBuild: device.shellMaterial &&
          (device.shellMaterial.isMetal || device.shellMaterial.isAluminum)
        ? 10
        : 0,
    };

    // Calculate the total features score and normalize it.
    // Maximum points is the number of features * 10.
    const maxFeaturePoints = Object.keys(features).length * 10;
    const featuresScore = Object.values(features).reduce(
      (sum, value) => sum + value,
      0,
    );
    const normalizedFeaturesScore = (featuresScore / maxFeaturePoints) * 10;

    // Combine performance and features with equal weighting (50% each).
    const finalScore = (performanceScore * 0.5) +
      (normalizedFeaturesScore * 0.5);

    // Ensure the final score is between 0 and 10.
    return Math.max(0, Math.min(10, finalScore));
  }
}
