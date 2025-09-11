import { useEffect, useState } from "preact/hooks";
import { SystemRating } from "../../data/frontend/models/system-rating.model.ts";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const ratingDescriptions = {
    ALL: "Excellent on all systems",
    A: "Excellent",
    B: "Playable",
    C: "Playable with tweaks",
    D: "Barely works",
    F: "Doesn't work",
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark =
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    }
  });

  const getRatingInfo = (
    rating: SystemRating,
  ) => {
    const systemName = tooltipUseShortSystemName
      ? rating.system
      : rating.system;
    const ratingMark = rating.ratingMark.toUpperCase();
    const ratingClass = `rating-info rating-${ratingMark}`;
    const description = useRatingDescription
      ? ratingDescriptions[ratingMark as keyof typeof ratingDescriptions]
      : "";
    return {
      className: ratingClass,
      text: ratingMark === "ALL"
        ? ratingDescriptions.ALL
        : `${systemName}: ${description} ${rating.ratingNumber}/5`,
    };
  };

  const { className, text } = getRatingInfo(rating);

  return (
    <div
      class={className}
      data-tooltip={text}
      data-placement={tooltipPosition}
    >
      {rating.system}
    </div>
  );
}
