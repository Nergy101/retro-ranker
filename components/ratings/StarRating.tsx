import {
  PiQuestion,
  PiStar,
  PiStarFill,
  PiStarHalfFill,
} from "@preact-icons/pi";
import { Device } from "../../data/models/device.model.ts";
interface StarRatingProps {
  device: Device;
}

export function StarRating({ device }: StarRatingProps) {
  // Calculate score based on system ratings and features
  const calculateScore = () => {
    let emulationScore = 0;
    let featuresScore = 0;

    // Calculate emulation score (max 50 points)
    const ratings = device.systemRatings;

    const systemWeights = {
      "Game Boy": 1,
      "NES": 1,
      "Genesis": 2,
      "Game Boy Advance": 2,
      "SNES": 2,
      "PS1": 3,
      "Nintendo DS": 3,
      "Nintendo 64": 4,
      "Dreamcast": 4,
      "PSP": 4,
      "Saturn": 5,
      "GameCube": 7,
      "Wii": 7,
      "3DS": 7,
      "PS2": 7,
      "Wii U": 8,
      "Switch": 10,
      "PS3": 10,
    };

    // Check if all ratings are "N/A"
    const allRatingsNA = ratings?.every((rating) =>
      rating.ratingMark === "N/A" || rating.ratingMark === undefined
    );

    if (allRatingsNA || allRatingsNA === undefined || ratings?.length === 0) {
      return null; // Return null to indicate no valid score
    }

    // Calculate weighted emulation score
    ratings?.forEach((rating) => {
      const weight =
        systemWeights[rating.system as keyof typeof systemWeights] || 1;
      switch (rating.ratingMark) {
        case "A":
          emulationScore += weight * 1;
          break;
        case "B":
          emulationScore += weight * 0.75;
          break;
        case "C":
          emulationScore += weight * 0.5;
          break;
        case "D":
          emulationScore += weight * 0.25;
          break;
        default:
          break;
      }
    });

    // Normalize emulation score to max 50 points
    const maxEmulationScore = Object.values(systemWeights).reduce(
      (a, b) => a + b,
      0,
    );
    emulationScore = (emulationScore / maxEmulationScore) * 50;

    // Calculate features score (max 50 points)
    const features = {
      // Display features (15 points)
      hasHDScreen: device.screen.ppi && device.screen.ppi >= 200 ? 5 : 0,
      hasGoodScreenSize:
        device.screen.size && parseFloat(device.screen.size) >= 5 ? 5 : 0,
      hasQualityPanel:
        device.screen.type && device.screen.type.toLowerCase()?.includes("ips")
          ? 5
          : 0,

      // Performance features (15 points)
      hasGoodCPU: device.cpu.cores && device.cpu.cores >= 4 ? 5 : 0,
      hasGoodRAM: device.ram && parseInt(device.ram) >= 4 ? 5 : 0,
      hasGoodCooling: device.cooling.raw &&
          device.cooling.raw.toLowerCase().includes("fan")
        ? 5
        : 0,

      // Connectivity features (10 points)
      hasWifi: device.connectivity.hasWifi ? 3 : 0,
      hasBluetooth: device.connectivity.hasBluetooth ? 3 : 0,
      hasHDMI: device.connectivity.hasHDMI ? 4 : 0,

      // Controls (10 points)
      hasAnalogs:
        device.controls.analogs.some((analog) =>
            analog.toLowerCase().includes("dual")
          )
          ? 5
          : 0,
      hasGoodButtons:
        device.controls.shoulderButtons.some((button) =>
            button.toLowerCase().includes("l2")
          )
          ? 5
          : 0,
    };

    featuresScore = Object.values(features).reduce((a, b) => a + b, 0);

    // Calculate final score (1-10 scale)
    const totalScore = emulationScore + featuresScore;
    return Math.max(1, Math.min(10, totalScore / 10));
  };

  // Get normalized rating (1-10)
  const normalizedRating = calculateScore();

  // If all ratings are "N/A", return a question mark icon
  if (normalizedRating === null) {
    return (
      <span
        data-placement="bottom"
        data-tooltip="No emulation ratings available"
      >
        <PiQuestion />
      </span>
    );
  }

  // Convert to 5-point scale for stars
  const fivePointRating = normalizedRating / 2;

  // Round to nearest 0.5
  const roundedRating = Math.round(fivePointRating * 2) / 2;

  // Calculate full and half stars needed
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  return (
    <span
      style="display: flex; color: var(--pico-primary);"
      data-placement="bottom"
      data-tooltip={`Emulation Rating: ${fivePointRating.toFixed(1)}/5`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map(() => <PiStarFill />)}

      {/* Half star if needed */}
      {hasHalfStar && <PiStarHalfFill />}

      {/* Empty stars */}
      {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map(() => (
        <PiStar />
      ))}
    </span>
  );
}
