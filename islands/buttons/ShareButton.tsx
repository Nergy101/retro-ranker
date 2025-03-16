import { PiShare } from "@preact-icons/pi";

export function ShareButton(
  { title, tooltip = "Share", shareTitle, url, appearance = "default" }: {
    title: string;
    tooltip?: string;
    shareTitle: string;
    url: string;
    appearance?: "default" | "outline" | "outline contrast" | "outline secondary";
  },
) {
  const handleShare = () => {
    navigator.share({
      title: shareTitle,
      url,
    });
  };

  if (appearance === "outline" || appearance === "outline contrast" || appearance === "outline secondary") {
    return (
      <button
        class={`button secondary ${appearance}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          cursor: "pointer",
        }}
        aria-label="Share page"
        onClick={handleShare}
        data-tooltip={tooltip}
        data-placement="bottom"
        role="button"
        type="button"
      >
        <PiShare />
        <span class="device-detail-action-button-label">{title}</span>
      </button>
    );
  }

  return (
    <div
      aria-label="Share page"
      class="device-detail-action-button"
      onClick={handleShare}
      data-tooltip={tooltip}
      data-placement="right"
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          cursor: "pointer",
        }}
      >
        <PiShare />
        <span class="device-detail-action-button-label">Share</span>
      </span>
    </div>
  );
}
