import { EmulationTier } from "../data/device.model.ts";

interface StarRatingProps {
  performanceRating: {
    rating: number;
    normalizedRating: number;
    tier: EmulationTier;
    maxEmulation: string;
  };
}

export function StarRating({ performanceRating }: StarRatingProps) {
  // Convert 10-point scale to 5-point scale
  const fivePointRating = performanceRating.normalizedRating / 2;

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
      data-tooltip={`Rating: ${performanceRating.normalizedRating}/10, ${performanceRating.maxEmulation}`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <i key={`full-${i}`} class="ph-fill ph-star" />
      ))}

      {/* Half star if needed */}
      {hasHalfStar && <i class="ph-fill ph-star-half" />}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <i key={`empty-${i}`} class="ph ph-star-light" />
      ))}
    </p>
  );
}
