import { Device } from "../data/models/device.model.ts";

interface StarRatingProps {
  device: Device;
}

export function StarRating({ device }: StarRatingProps) {
  // Calculate score based on system ratings and features
  const calculateScore = () => {
    let emulationScore = 0;
    let featuresScore = 0;

    // Calculate emulation score (max 50 points)
    const ratings = device.consoleRatings;

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
      "GameCube": 6,
      "Wii": 7,
      "3DS": 7,
      "PS2": 7,
      "Wii U": 8,
      "Switch": 9,
      "PS3": 10,
    };

    // Check if all ratings are "N/A"
    const allRatingsNA = ratings?.every((rating: {
      rating: string;
      system: string;
    }) => rating.rating === "N/A" || rating.rating === undefined);

    if (allRatingsNA || allRatingsNA === undefined || ratings?.length === 0) {
      return null; // Return null to indicate no valid score
    }

    // Calculate weighted emulation score
    ratings?.forEach((rating: {
      rating: string;
      system: string;
    }) => {
      const weight = systemWeights[rating.system] || 1;
      if (rating.rating === "A") {
        emulationScore += weight * 1;
      } else if (rating.rating === "B") {
        emulationScore += weight * 0.75;
      } else if (rating.rating === "C") {
        emulationScore += weight * 0.5;
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
      hasHDScreen: device.screen.ppi >= 200 ? 5 : 0,
      hasGoodScreenSize: parseFloat(device.screenSize) >= 5 ? 5 : 0,
      hasQualityPanel: device.screen.type.toLowerCase()?.includes("ips")
        ? 5
        : 0,

      // Performance features (15 points)
      hasGoodCPU: device.cpu.cores >= 4 ? 5 : 0,
      hasGoodRAM: parseInt(device.ram) >= 4 ? 5 : 0,
      hasGoodCooling: device.cooling.raw.toLowerCase().includes("active")
        ? 5
        : 0,

      // Connectivity features (10 points)
      hasWifi: device.connectivity.hasWifi ? 3 : 0,
      hasBluetooth: device.connectivity.hasBluetooth ? 3 : 0,
      hasHDMI: device.connectivity.hasHDMI ? 4 : 0,

      // Controls (10 points)
      hasAnalogs: device.controls.analogs.toLowerCase().includes("dual")
        ? 5
        : 0,
      hasGoodButtons:
        device.controls.shoulderButtons.toLowerCase().includes("l2") ? 5 : 0,
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
        <i class="ph ph-question">
        </i>
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
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <p
      style="display: inline-flex; color: var(--pico-primary);"
      data-placement="bottom"
      data-tooltip={`Emulation Rating: ${fivePointRating.toFixed(1)}/5`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <i key={`full-${i}`} class="ph-fill ph-star" />
      ))}

      {/* Half star if needed */}
      {hasHalfStar && <i class="ph-fill ph-star-half" />}

      {/* Empty stars */}
      {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
        <i key={`empty-${i}`} class="ph ph-star" />
      ))}
    </p>
  );
}
