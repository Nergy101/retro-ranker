import { Device } from "../../data/device.model.ts";
import { EmulationTier } from "../../data/enums/EmulationTier.ts";
import { Ranking } from "../../data/models/ranking.model.ts";

export class RatingsService {
  private static instance: RatingsService;

  private constructor() {}

  public static getInstance(): RatingsService {
    if (!RatingsService.instance) {
      RatingsService.instance = new RatingsService();
    }
    return RatingsService.instance;
  }

  public static parseSystemRatingMark(value: string): string {
    if (value.includes("a")) return "A";
    if (value.includes("b")) return "B";
    if (value.includes("c")) return "C";
    if (value.includes("d")) return "D";
    if (value.includes("f")) return "F";
    return "N/A";
  }

  public static parseSystemRatingNumber(value: string): number | null {
    if (value.includes("a")) return 5;
    if (value.includes("b")) return 4;
    if (value.includes("c")) return 3;
    if (value.includes("d")) return 2;
    if (value.includes("f")) return 1;
    return null;
  }

  public static parsePerformanceRating(text: string): {
    rating: number;
    normalizedRating: number;
    tier: EmulationTier;
    maxEmulation: string;
    emulationLimit: string;
  } {
    // Count occurrences for each symbol.
    const starCount = (text.match(/⭐️/g) || []).length;
    const explosionCount = (text.match(/💥/g) || []).length;
    const fireCount = (text.match(/🔥/g) || []).length;

    let rating = 0;
    let maxEmulation = "";

    // Prefer the highest "cluster": fire > explosion > star.
    if (fireCount > 0) {
      // For fire symbols, we assign:
      // 1 fire -> rating 11, 2 fires -> rating 12, ... 5 fires -> rating 15.
      rating = 10 + fireCount;
      const fireMessages = [
        "3DS/PS2 all full speed, most Wii U playable, some Switch playable",
        "Most Switch playable, some PS3 playable",
        "All Switch playable, most PS3 playable",
        "All PS3 playable",
        "Limits unknown",
      ];
      maxEmulation = fireMessages[fireCount - 1] ||
        fireMessages[fireMessages.length - 1];
    } else if (explosionCount > 0) {
      // For explosion symbols, we assign:
      // 1 explosion -> rating 6, 2 explosions -> rating 7, ... 5 explosions -> rating 10.
      rating = 5 + explosionCount;
      const explosionMessages = [
        "Most DS/N64/PSP/DC all full speed, most Saturn playable",
        "DS/N64/PSP/DC/Saturn full speed, some GameCube playable",
        "Most GameCube playable, some Wii/3DS playable",
        "GameCube mostly all full speed, most Wii/3DS playable, some PS2/Wii U playable",
        "GameCube/Wii all full speed, most 3DS/PS2 playable, some Wii U playable",
      ];
      maxEmulation = explosionMessages[explosionCount - 1] ||
        explosionMessages[explosionMessages.length - 1];
    } else if (starCount > 0) {
      // For star symbols, rating is simply the star count (1–5).
      rating = starCount;
      const starMessages = [
        "GB/GBC/GG/NES/SMS/all previous retro consoles all full speed",
        "Most GBA & Genesis playable, some SNES playable",
        "GBA & Genesis all full speed, most SNES/PS1 playable",
        "SNES/PS1 all full speed, most DS playable, some N64/DC/PSP playable",
        "Most DS/N64/PSP/DC playable, some Saturn playable",
      ];
      maxEmulation = starMessages[starCount - 1] ||
        starMessages[starMessages.length - 1];
    }

    // If no valid symbols were found, fall back to a default rating.
    if (rating === 0) {
      return {
        rating: 0,
        normalizedRating: 0,
        tier: "Unknown" as EmulationTier,
        maxEmulation: "",
        emulationLimit: "",
      };
    }

    // Normalize the raw rating so that the top possible score (15) maps to 10.
    const normalizedRating = Number(((rating / 15) * 10).toFixed(1));

    // Maintain the original text as the tier (casting to EmulationTier).
    const tier = text as EmulationTier;

    return {
      rating,
      normalizedRating,
      tier,
      maxEmulation,
      emulationLimit: "",
    };
  }

  public static getSimilarityScore(
    device: Device,
    targetDevice: Device,
  ): number {
    let score = 0;

    // Same brand
    if (device.brand === targetDevice.brand) score += 3;

    // Similar form factor
    if (device.formFactor === targetDevice.formFactor) score += 2;

    // Similar performance tier
    if (device.performance.tier === targetDevice.performance.tier) score += 2;

    // Similar price category
    if (device.pricing.category === targetDevice.pricing.category) score += 1;

    // Similar architecture
    if (device.architecture === targetDevice.architecture) score += 1;

    // Similar screen size
    if (
      device.screen.size &&
      targetDevice.screen.size &&
      Math.abs(device.screen.size - targetDevice.screen.size) < 1
    ) {
      score += 1;
    }

    return score;
  }

  public createRanking(devices: Device[]): Ranking {
    const ranking: Ranking = {
      emuPerformance: this.rankDevicesByEmuPerformance(devices),
      monitor: this.rankDevicesByMonitor(devices),
      dimensions: this.rankDevicesByDimensions(devices),
      connectivity: this.rankDevicesByConnectivity(devices),
      audio: this.rankDevicesByAudio(devices),
      controls: this.rankDevicesByControls(devices),
      misc: this.rankDevicesByMisc(devices),
      all: [],
    };

    ranking.all = this.rankDevicesByAll(devices, ranking);

    return ranking;
  }

  private rankDevicesByEmuPerformance(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculatePerformanceScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  // Helper method to normalize a raw score into the 1 (worst) to 10 (best) range.
  // If the raw score is below min, returns 1; if above max, returns 10;
  // otherwise does a linear mapping.
  private normalizeFacetScore(raw: number, min: number, max: number): number {
    if (raw <= min) return 1;
    if (raw >= max) return 10;
    return 1 + ((raw - min) / (max - min)) * 9;
  }

  calculatePerformanceScore(device: Device): number {
    // Our expected raw performance score: 0 (worst) to about 12 (best)
    let rawScore = device.performance.normalizedRating ?? 0;
    if (device.ram?.sizes?.[0]) {
      rawScore += Math.log2(device.ram.sizes[0]) * 0.1;
    }
    if (device.ram?.unit === "GB") rawScore += 1;
    if (device.ram?.unit === "MB") rawScore += 0.5;
    if (device.ram?.unit === "KB") rawScore += 0.25;
    const normalized = this.normalizeFacetScore(rawScore, 0, 12);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByMonitor(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateMonitorScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateMonitorScore(device: Device): number {
    let score = 0;

    if (device.screen.type) {
      // Determine a base score based on the panel type.
      // OLEDs, AMOLEDs, and MonochromeOLEDs get a high base score,
      // IPS screens get a lower base score, and other types are scored accordingly.
      let baseScore = 0;
      switch (device.screen.type.type) {
        case "OLED":
        case "AMOLED":
          baseScore = 300;
          break;
        case "LTPS":
          baseScore = 250;
          break;
        case "MonochromeOLED":
          baseScore = 200;
          break;
        case "IPS":
          baseScore = 200;
          break;
        case "LCD":
          baseScore = 150;
          break;
        case "TFT":
          baseScore = 100;
          break;
        default:
          baseScore = 50;
      }

      // Bonuses for extra features.
      if (device.screen.type.isTouchscreen) {
        baseScore += 10;
      }
      if (device.screen.type.isPenCapable) {
        baseScore += 10;
      }

      // Add a small contribution from PPI, to allow devices with the same panel type
      // to be differentiated by higher DPI. The weight is reduced compared to the type score.
      const ppi = device.screen.ppi?.[0] ?? 0;
      const ppiContribution = ppi * 0.05; // e.g., 300 PPI adds about 15 points and 200PPI adds about 10 points

      score = baseScore + ppiContribution;
    } else {
      // Fallback: if no panel type info is available, use the PPI with a reduced weight.
      score = (device.screen.ppi?.[0] ?? 0) * 0.05;
    }

    // Normalize the score so that the final monitor rating is scaled between 1 (worst) and 10 (best).
    // The expected score range is roughly 50 (lowest) to 320 (highest) based on the chosen constants.
    const normalized = this.normalizeFacetScore(score, 50, 360);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByDimensions(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateDimensionScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateDimensionScore(device: Device): number {
    // If dimensions are missing, return the worst value.
    if (!device.dimensions) return 1;
    const { length, width, height } = device.dimensions;
    const lengthScore = length ? length / 100 : 0;
    const widthScore = width ? width / 100 : 0;
    const heightScore = height ? height / 100 : 0;
    const volumeScore = (lengthScore * widthScore * heightScore) / 100;
    let rawScore = volumeScore;
    if (device.shellMaterial) {
      if (device.shellMaterial.isMetal) rawScore += 1;
      if (device.shellMaterial.isAluminum) rawScore += 0.9;
      if (device.shellMaterial.isMagnesiumAlloy) rawScore += 1.25;
    }
    if (device.weight) {
      rawScore = rawScore / Math.log(device.weight + 1);
    }
    if (device.battery?.capacity) {
      rawScore += Math.log10(device.battery.capacity);
    }
    // We assume an expected raw dimension score between 0 and ~6.
    const normalized = this.normalizeFacetScore(rawScore, 0, 6);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByConnectivity(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateConnectivityScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateConnectivityScore(device: Device): number {
    let rawScore = 0;
    if (device.connectivity.hasWifi) rawScore += 2;
    if (device.connectivity.hasBluetooth) rawScore += 2;
    if (device.connectivity.hasUsbC) rawScore += 3;
    if (device.connectivity.hasNfc) rawScore += 1;
    if (device.connectivity.hasUsb) rawScore += 1;
    if (device.outputs.videoOutput) {
      if (device.outputs.videoOutput?.AV) rawScore += 1;
      if (device.outputs.videoOutput?.hasHdmi) rawScore += 2;
      if (device.outputs.videoOutput?.hasDisplayPort) rawScore += 2;
      if (device.outputs.videoOutput?.hasVga) rawScore += 1;
      if (device.outputs.videoOutput?.hasDvi) rawScore += 1;
      if (device.outputs.videoOutput.hasUsbC) rawScore += 2;
      if (device.outputs.videoOutput.hasMicroHdmi) rawScore += 1;
      if (device.outputs.videoOutput.hasMiniHdmi) rawScore += 1;
      if (device.outputs.videoOutput.OcuLink) rawScore += 1;
    }
    // Expected raw connectivity score from 0 (poor) to around 14 (rich features)
    const normalized = this.normalizeFacetScore(rawScore, 0, 14);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByAudio(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateAudioScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateAudioScore(device: Device): number {
    let rawScore = 0;
    if (device.outputs.audioOutput) {
      if (device.outputs.audioOutput.has35mmJack) rawScore += 1;
      if (device.outputs.audioOutput.hasHeadphoneJack) rawScore += 1;
      if (device.outputs.audioOutput.hasUsbC) rawScore += 2;
      if (device.outputs.speaker?.type === "stereo") rawScore += 1;
      if (device.outputs.speaker?.type === "mono") rawScore += 0.5;
    }
    // Expected raw audio score from 0 to 5.
    const normalized = this.normalizeFacetScore(rawScore, 0, 5);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByControls(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateControlsScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateControlsScore(device: Device): number {
    let rawScore = 0;
    if (device.controls.dPad) {
      if (device.controls.dPad.type === "cross") rawScore += 1;
      if (device.controls.dPad.type === "d-pad") rawScore += 1;
    }
    if (device.controls.analogs) {
      if (device.controls.analogs.dual) rawScore += 2;
      else if (device.controls.analogs.single) rawScore += 1;
      if (device.controls.analogs.isHallSensor) rawScore += 1;
      if (device.controls.analogs.L3) rawScore += 0.5;
      if (device.controls.analogs.R3) rawScore += 0.5;
    }
    if (device.controls.numberOfFaceButtons) {
      rawScore += device.controls.numberOfFaceButtons;
    }
    if (device.controls.shoulderButtons) {
      const shoulderButtons = device.controls.shoulderButtons;
      if (shoulderButtons.L1) rawScore += 1;
      if (shoulderButtons.L2) rawScore += 1;
      if (shoulderButtons.L3) rawScore += 1;
      if (shoulderButtons.R1) rawScore += 1;
      if (shoulderButtons.R2) rawScore += 1;
      if (shoulderButtons.R3) rawScore += 1;
      if (shoulderButtons.M1) rawScore += 0.5;
      if (shoulderButtons.M2) rawScore += 0.5;
    }
    if (device.controls.extraButtons) {
      const extraButtons = device.controls.extraButtons;
      if (extraButtons.home) rawScore += 1;
      if (extraButtons.function) rawScore += 1;
      if (extraButtons.turbo) rawScore += 1;
      if (extraButtons.touchpad) rawScore += 1;
      if (extraButtons.programmableButtons) rawScore += 1;
    }
    if (device.rumble) rawScore += 2;
    // Expected raw controls score from 0 to ~23.
    const normalized = this.normalizeFacetScore(rawScore, 0, 23);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByMisc(devices: Device[]): string[] {
    const rankedDevices = devices
      .map((device) => ({
        name: device.name.sanitized,
        score: this.calculateMiscScore(device),
      }))
      .sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      rankedDevices[0].score === rankedDevices[1].score
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }

  calculateMiscScore(device: Device): number {
    let rawScore = 0;
    if (device.battery?.capacity) {
      rawScore += Math.log10(device.battery.capacity);
    }
    if (device.cooling) {
      if (device.cooling.hasFan) rawScore += 1;
      if (device.cooling.hasHeatsink) rawScore += 1;
      if (device.cooling.hasHeatPipe) rawScore += 1;
      if (device.cooling.hasVentilationCutouts) rawScore += 1;
    }
    if (device.sensors) {
      if (device.sensors.hasGyroscope) rawScore += 1;
      if (device.sensors.hasAccelerometer) rawScore += 1;
      if (device.sensors.hasMicrophone) rawScore += 1;
      if (device.sensors.hasCamera) rawScore += 1;
      if (device.sensors.hasFingerprintSensor) rawScore += 1;
    }
    if (device.volumeControl?.type === "dedicated-button") rawScore += 1;
    if (device.brightnessControl?.type === "dedicated-button") rawScore += 1;
    // Expected raw misc score from 0 to about 15.
    const normalized = this.normalizeFacetScore(rawScore, 0, 15);
    return Number(normalized.toFixed(1));
  }

  private rankDevicesByAll(devices: Device[], ranking: Ranking): string[] {
    const deviceScores = devices.map((device) => {
      const name = device.name.sanitized;
      let score = 0;

      // Weight different ranking categories
      const weights = {
        emuPerformance: 0.3,
        monitor: 0.1,
        dimensions: 0.1,

        connectivity: 0.2,
        audio: 0.1,
        controls: 0.1,
        misc: 0.1,
      };

      const categories = [
        { rank: ranking.emuPerformance, weight: weights.emuPerformance },
        { rank: ranking.monitor, weight: weights.monitor },
        { rank: ranking.dimensions, weight: weights.dimensions },

        { rank: ranking.connectivity, weight: weights.connectivity },
        { rank: ranking.audio, weight: weights.audio },
        { rank: ranking.controls, weight: weights.controls },
        { rank: ranking.misc, weight: weights.misc },
      ];

      categories.forEach(({ rank, weight }) => {
        const position = rank.indexOf(name);
        if (position >= 0) {
          score += (devices.length - position) * weight;
        } else {
          score += devices.length * weight * 0.5; // Middle score for "equal" rankings
        }
      });

      return { name, score };
    });

    const rankedDevices = deviceScores.sort((a, b) => b.score - a.score);

    if (
      rankedDevices.length > 1 &&
      Math.abs(rankedDevices[0].score - rankedDevices[1].score) < 0.1
    ) {
      return ["equal"];
    }

    return rankedDevices.map((device) => device.name);
  }
}
