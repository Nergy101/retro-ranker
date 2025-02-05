import { PiShare } from "@preact-icons/pi";

export function ShareButton({ title, url }: { title: string; url: string }) {
  return (
    <div
      aria-label="Share page"
      class="device-detail-action-button"
      onClick={() => {
        navigator.share({
          title,
          url,
        });
      }}
      data-tooltip="Share"
      data-placement="bottom"
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
