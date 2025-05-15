import { EmulationSystemShort } from "../data/frontend/enums/emulation-system.ts";
import { SystemRating } from "../data/frontend/models/system-rating.model.ts";
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface RatingInfoProps {
  rating: SystemRating;
  tooltipPosition?: "top" | "bottom";
  tooltipUseShortSystemName?: boolean;
  useRatingDescription?: boolean;
}

const ratingDescriptions = {
  ALL: "Excellent on all systems",
  A: "Excellent",
  B: "Playable",
  C: "Playable with tweaks",
  D: "Barely works",
  F: "Doesn't work",
};

export default function RatingInfo(
  {
    rating,
    tooltipPosition = "top",
    tooltipUseShortSystemName = false,
    useRatingDescription = true,
  }: RatingInfoProps,
) {
  const theme = useSignal<"light" | "dark">("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.value = savedTheme as "light" | "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark =
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
      theme.value = prefersDark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme.value);
    }
  }, []);

  const getRatingInfo = (
    rating: SystemRating,
  ) => {
    const systemShort = EmulationSystemShort[rating.system];
    const systemName = tooltipUseShortSystemName ? systemShort : rating.system;
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

  const ratingInfo = useComputed(() => getRatingInfo(rating));
  const { className, text } = ratingInfo.value;

  return (
    <div
      class={className}
      data-tooltip={text}
      data-placement={tooltipPosition}
    >
      {EmulationSystemShort[rating.system] ?? rating.system}
    </div>
  );
}
