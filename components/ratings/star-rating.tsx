import { PiStar, PiStarFill, PiStarHalfFill } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";

interface StarRatingProps {
  device: Device;
}

export default function StarRating({ device }: StarRatingProps) {
  // Get normalized rating (1-10)
  const normalizedRating = DeviceService.calculateScore(device);

  // If all ratings are "N/A", return a question mark icon
  if (normalizedRating === null) {
    return (
      <span
        data-placement="bottom"
        data-tooltip="No emulation ratings available"
      >
        {DeviceService.getPropertyIconByCharacter(null)}
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
      style={{
        display: "flex",
        color: "var(--pico-primary)",
      }}
      data-placement="bottom"
      data-tooltip={`Emulation Rating: ${fivePointRating.toFixed(1)}/5`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <PiStarFill key={index} />
      ))}

      {/* Half star if needed */}
      {hasHalfStar && <PiStarHalfFill />}

      {/* Empty stars */}
      {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map(() => (
        <PiStar />
      ))}
    </span>
  );
}
