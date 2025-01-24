import { PiShare } from "@preact-icons/pi";

export function ShareButton({ title, url }: { title: string; url: string }) {
  return (
    <button
      class="secondary"
      aria-label="Share page"
      style={{ display: "flex", justifyContent: "center" }}
      data-tooltip="Share"
      data-placement="bottom"
      onClick={() => {
        navigator.share({
          title,
          url,
        });
      }}
    >
      <PiShare />
    </button>
  );
} 