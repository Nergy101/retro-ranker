import { EmulationTier } from "../../data/enums/EmulationTier.ts";
import { Device } from "../../data/device.model.ts";
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

  public static parsePerformanceRating(text: string, deviceName: string): {
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

  private calculatePerformanceScore(device: Device): number {
    // base score is 0-10
    let score = device.performance.normalizedRating ?? 0;

    // Bonus for more RAM and better RAM type
    if (device.ram?.sizes?.[0]) {
      score += Math.log2(device.ram.sizes[0]) * 0.1;
    }

    if (device.ram?.unit === "GB") score += 1;
    if (device.ram?.unit === "MB") score += 0.5;
    if (device.ram?.unit === "KB") score += 0.25;

    return score;
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

  private calculateMonitorScore(device: Device): number {
    let score = device.screen.ppi?.[0] ?? 0;

    // Bonus for better screen types
    if (device.screen.type) {
      if (device.screen.type.type === "OLED") score += 1;
      if (device.screen.type.type === "IPS") score += .9;
      if (device.screen.type.type === "AMOLED") score += 1;
      if (device.screen.type.type === "MonochromeOLED") score += 1;
      if (device.screen.type.type === "LCD") score += .6;
      if (device.screen.type.type === "LTPS") score += .6;
      if (device.screen.type.type === "TFT") score += .5;
      if (device.screen.type.isTouchscreen) score += 1;
      if (device.screen.type.isPenCapable) score += 1;
    }

    return score;
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

  private calculateDimensionScore(device: Device): number {
    if (!device.dimensions) return 0;

    const { length, width, height } = device.dimensions;
    // make between 0 and 1
    const lengthScore = length ? length / 100 : 0;
    const widthScore = width ? width / 100 : 0;
    const heightScore = height ? height / 100 : 0;
    const volumeScore = (lengthScore * widthScore * heightScore) / 100;

    let score = volumeScore;

    // Bonus for premium materials
    if (device.shellMaterial) {
      if (device.shellMaterial.isMetal) score += 1;
      if (device.shellMaterial.isAluminum) score += .9;
      if (device.shellMaterial.isMagnesiumAlloy) score += 1.25;
    }

    // Weight consideration
    if (device.weight) {
      score = score / Math.log(device.weight + 1);
    }

    return score;
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

  private calculateConnectivityScore(device: Device): number {
    let score = 0;

    // Basic connectivity
    if (device.connectivity.hasWifi) score += 2;
    if (device.connectivity.hasBluetooth) score += 2;
    if (device.connectivity.hasUsbC) score += 3;
    if (device.connectivity.hasNfc) score += 1;
    if (device.connectivity.hasUsb) score += 1;

    // Video output capabilities
    if (device.outputs.videoOutput) {
      if (device.outputs.videoOutput?.AV) score += 1;
      if (device.outputs.videoOutput?.hasHdmi) score += 2;
      if (device.outputs.videoOutput?.hasDisplayPort) score += 2;
      if (device.outputs.videoOutput?.hasVga) score += 1;
      if (device.outputs.videoOutput?.hasDvi) score += 1;
      if (device.outputs.videoOutput.hasUsbC) score += 2;
      if (device.outputs.videoOutput.hasMicroHdmi) score += 1;
      if (device.outputs.videoOutput.hasMiniHdmi) score += 1;
      if (device.outputs.videoOutput.OcuLink) score += 1;
    }

    return score;
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

  private calculateAudioScore(device: Device): number {
    let score = 0;

    // Audio output capabilities
    if (device.outputs.audioOutput) {
      if (device.outputs.audioOutput.has35mmJack) score += 1;
      if (device.outputs.audioOutput.hasHeadphoneJack) score += 1;
      if (device.outputs.audioOutput.hasUsbC) score += 2;
      if (device.outputs.speaker?.type === "stereo") score += 1;
      if (device.outputs.speaker?.type === "mono") score += .5;
    }

    return score;
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

  private calculateControlsScore(device: Device): number {
    let score = 0;

    // D-Pad
    if (device.controls.dPad) {
      if (device.controls.dPad.type === "cross") score += 1;
      if (device.controls.dPad.type === "d-pad") score += 1;
    }

    // Analog sticks
    if (device.controls.analogs) {
      if (device.controls.analogs.dual) score += 2;
      else if (device.controls.analogs.single) score += 1;

      if (device.controls.analogs.isHallSensor) score += 1;
      if (device.controls.analogs.L3) score += .5;
      if (device.controls.analogs.R3) score += .5;
    }

    // Face buttons
    if (device.controls.numberOfFaceButtons) {
      score += device.controls.numberOfFaceButtons;
    }

    // Shoulder buttons
    if (device.controls.shoulderButtons) {
      const shoulderButtons = device.controls.shoulderButtons;
      if (shoulderButtons.L1) score += 1;
      if (shoulderButtons.L2) score += 1;
      if (shoulderButtons.L3) score += 1;
      if (shoulderButtons.R1) score += 1;
      if (shoulderButtons.R2) score += 1;
      if (shoulderButtons.R3) score += 1;
      if (shoulderButtons.M1) score += 0.5;
      if (shoulderButtons.M2) score += 0.5;
    }

    // Extra buttons
    if (device.controls.extraButtons) {
      const extraButtons = device.controls.extraButtons;
      if (extraButtons.home) score += 1;
      if (extraButtons.function) score += 1;
      if (extraButtons.turbo) score += 1;
      if (extraButtons.touchpad) score += 1;
      if (extraButtons.programmableButtons) score += 1;
    }

    // Additional features
    if (device.rumble) score += 2;

    return score;
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

  private calculateMiscScore(device: Device): number {
    let score = 0;

    // Battery
    if (device.battery?.capacity) {
      score += Math.log10(device.battery.capacity);
    }

    // Cooling
    if (device.cooling) {
      if (device.cooling.hasFan) score += 1;
      if (device.cooling.hasHeatsink) score += 1;
      if (device.cooling.hasHeatPipe) score += 1;
      if (device.cooling.hasVentilationCutouts) score += 1;
    }

    // Sensors
    if (device.sensors) {
      if (device.sensors.hasGyroscope) score += 1;
      if (device.sensors.hasAccelerometer) score += 1;
      if (device.sensors.hasMicrophone) score += 1;
      if (device.sensors.hasCamera) score += 1;
      if (device.sensors.hasFingerprintSensor) score += 1;
    }

    // Controls
    if (device.volumeControl?.type === "dedicated-button") score += 1;
    if (device.brightnessControl?.type === "dedicated-button") score += 1;

    return score;
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
