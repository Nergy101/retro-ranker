import { EmulationSystemShort } from "../../data/enums/EmulationSystem.ts";
import { SystemRating } from "../../data/models/system-rating.model.ts";

interface RatingInfoProps {
  rating: SystemRating;
  tooltipPosition?: "top" | "bottom";
}

const getRatingInfo = (
  rating: SystemRating
) => {
  const systemShort = EmulationSystemShort[rating.system];
  switch (rating.ratingMark.toUpperCase()) {
    case "A":
      return {
        color: "#16833E",
        text: `${systemShort}: Excellent ${rating.ratingNumber}/5`,
        textColor: "white",
      };
    case "B":
      return {
        color: "#3952A2",
        text: `${systemShort}: Playable ${rating.ratingNumber}/5`,
        textColor: "white",
      };
    case "C":
      return {
        color: "#EEB61B",
        text: `${systemShort}: Playable with tweaks ${rating.ratingNumber}/5`,
        textColor: "black",
      };
    case "D":
      return {
        color: "#fb923c",
        text: `${systemShort}: Barely works ${rating.ratingNumber}/5`,
        textColor: "black",
      };
    case "F":
      return {
        color: "#AB0D0D",
        text: `${systemShort}: Doesn't work ${rating.ratingNumber}/5`,
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

export function RatingInfo({ rating, tooltipPosition = "top" }: RatingInfoProps) {
  const { color, text, textColor } = getRatingInfo(rating);

  return (
    <div
      class="rating-info"
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      <span data-tooltip={text} data-placement={tooltipPosition}>
        {EmulationSystemShort[rating.system] ?? rating.system}
      </span>
    </div>
  );
}
