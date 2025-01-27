import { SystemRating } from "../data/models/system-rating.model.ts";

interface RatingInfoProps {
  rating: SystemRating;
}

const getRatingInfo = (rating: string) => {
  switch (rating.toUpperCase()) {
    case "A":
      return { color: "#16833E", text: "Excellent 5/5", textColor: "white" };
    case "B":
      return { color: "#3952A2", text: "Playable 4/5", textColor: "white" };
    case "C":
      return {
        color: "#EEB61B",
        text: "Playable with tweaks 3/5",
        textColor: "black",
      };
    case "D":
      return { color: "#fb923c", text: "Barely works 2/5", textColor: "black" };
    case "F":
      return { color: "#AB0D0D", text: "Doesn't work 1/5", textColor: "white" };
    default:
      return {
        color: "var(--pico-contrast)",
        text: "Unknown",
        textColor: "black",
      };
  }
};

export function RatingInfo({ rating }: RatingInfoProps) {
  const { color, text, textColor } = getRatingInfo(rating.rating);

  return (
    <div
      style={{
        backgroundColor: color,
        padding: "0.25rem",
        borderRadius: "0.5em",
        textAlign: "center",
        color: textColor,
        fontSize: "0.75rem",
      }}
    >
      <span data-tooltip={text}>{rating.system}</span>
    </div>
  );
}
