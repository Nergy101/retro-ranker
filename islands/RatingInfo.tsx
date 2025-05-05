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

const ratingColors = {
  light: {
    ALL: { bg: "#E8F5E9", text: "#2E7D32" },
    A: { bg: "#E8F5E9", text: "#2E7D32" },
    B: { bg: "#E3F2FD", text: "#1565C0" },
    C: { bg: "#FFF3E0", text: "#E65100" },
    D: { bg: "#FFF3E0", text: "#E65100" },
    F: { bg: "#FFE5E5", text: "#B71C1C" },
    default: {
      bg: "var(--pico-card-background-color)",
      text: "var(--pico-text)",
    },
  },
  dark: {
    ALL: { bg: "#1B5E20", text: "#A5D6A7" },
    A: { bg: "#1B5E20", text: "#A5D6A7" },
    B: { bg: "#0D47A1", text: "#90CAF9" },
    C: { bg: "#E65100", text: "#FFCC80" },
    D: { bg: "#E65100", text: "#FFCC80" },
    F: { bg: "#B71C1C", text: "#EF9A9A" },
    default: {
      bg: "var(--pico-card-background-color)",
      text: "var(--pico-text)",
    },
  },
};

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

    const colors = ratingColors[theme.value][
      ratingMark as keyof typeof ratingColors.light
    ] || ratingColors[theme.value].default;
    const description = useRatingDescription
      ? ratingDescriptions[ratingMark as keyof typeof ratingDescriptions]
      : "";

    return {
      color: colors.bg,
      textColor: colors.text,
      text: ratingMark === "ALL"
        ? ratingDescriptions.ALL
        : `${systemName}: ${description} ${rating.ratingNumber}/5`,
    };
  };

  const ratingInfo = useComputed(() => getRatingInfo(rating));
  const { color, text, textColor } = ratingInfo.value;

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
