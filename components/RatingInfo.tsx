import { EmulationSystemShort } from "../data/enums/EmulationSystem.ts";
import { SystemRating } from "../data/models/system-rating.model.ts";

interface RatingInfoProps {
  rating: SystemRating;
}

const getRatingInfo = (rating: SystemRating) => {
  switch (rating.ratingMark.toUpperCase()) {
    case "A":
      return {
        color: "#16833E",
        text: `${rating.system}: Excellent ${rating.ratingNumber}/5`,
        textColor: "white",
      };
    case "B":
      return {
        color: "#3952A2",
        text: `${rating.system}: Playable ${rating.ratingNumber}/5`,
        textColor: "white",
      };
    case "C":
      return {
        color: "#EEB61B",
        text: `${rating.system}: Playable with tweaks ${rating.ratingNumber}/5`,
        textColor: "black",
      };
    case "D":
      return {
        color: "#fb923c",
        text: `${rating.system}: Barely works ${rating.ratingNumber}/5`,
        textColor: "black",
      };
    case "F":
      return {
        color: "#AB0D0D",
        text: `${rating.system}: Doesn't work ${rating.ratingNumber}/5`,
        textColor: "white",
      };
    default:
      return {
        color: "var(--pico-contrast)",
        text: "Unknown",
        textColor: "black",
      };
  }
};

export function RatingInfo({ rating }: RatingInfoProps) {
  const { color, text, textColor } = getRatingInfo(rating);

  return (
    <div
      class="rating-info"
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      <span data-tooltip={text}>
        {EmulationSystemShort[rating.system] ?? rating.system}
      </span>
    </div>
  );
}
