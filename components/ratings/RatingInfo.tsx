import { EmulationSystemShort } from "../../data/enums/EmulationSystem.ts";
import { SystemRating } from "../../data/models/system-rating.model.ts";

interface RatingInfoProps {
  rating: SystemRating;
  tooltipPosition?: "top" | "bottom";
  tooltipUseShortSystemName?: boolean;
  useRatingDescription?: boolean;
}

export function RatingInfo(
  {
    rating,
    tooltipPosition = "top",
    tooltipUseShortSystemName = false,
    useRatingDescription = true,
  }: RatingInfoProps,
) {
  const getRatingInfo = (
    rating: SystemRating,
  ) => {
    const systemShort = EmulationSystemShort[rating.system];

    const systemName = tooltipUseShortSystemName ? systemShort : rating.system;

    switch (rating.ratingMark.toUpperCase()) {
      case "ALL":
        return {
          color: "#16833E",
          text: `Excellent on all systems`,
          textColor: "white",
        };
      case "A":
        return {
          color: "#16833E",
          text: `${systemName}: ${
            useRatingDescription ? "Excellent" : ""
          } ${rating.ratingNumber}/5`,
          textColor: "white",
        };
      case "B":
        return {
          color: "#3952A2",
          text: `${systemName}: ${
            useRatingDescription ? "Playable" : ""
          } ${rating.ratingNumber}/5`,
          textColor: "white",
        };
      case "C":
        return {
          color: "#EEB61B",
          text: `${systemName}: ${
            useRatingDescription ? "Playable with tweaks" : ""
          } ${rating.ratingNumber}/5`,
          textColor: "black",
        };
      case "D":
        return {
          color: "#fb923c",
          text: `${systemName}: ${
            useRatingDescription ? "Barely works" : ""
          } ${rating.ratingNumber}/5`,
          textColor: "black",
        };
      case "F":
        return {
          color: "#AB0D0D",
          text: `${systemName}: ${
            useRatingDescription ? "Doesn't work" : ""
          } ${rating.ratingNumber}/5`,
          textColor: "white",
        };
      default:
        return {
          text: "Unknown",
          color: "var(--pico-card-background-color)",
          textColor: "var(--pico-text)",
        };
    }
  };

  const { color, text, textColor } = getRatingInfo(rating);

  return (
    <div
      class="rating-info"
      style={{
        backgroundColor: color,
        color: textColor,
        border: "1px solid var(--pico-contrast)",
      }}
      data-tooltip={text}
      data-placement={tooltipPosition}
    >
      {EmulationSystemShort[rating.system] ?? rating.system}
    </div>
  );
}
