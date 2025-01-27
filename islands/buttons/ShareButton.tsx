import { PiShare } from "@preact-icons/pi";

export function ShareButton({ title, url }: { title: string; url: string }) {
  return (
    <div
      aria-label="Share page"
      style={{
        display: "flex",
        justifyContent: "center"
      }}
      onClick={() => {
        navigator.share({
          title,
          url,
        });
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          borderBottom: "none",
          cursor: "pointer",
        }}
        data-tooltip="Share"
        data-placement="bottom"
      >
        <PiShare /> Share
      </span>
    </div>
  );
}
