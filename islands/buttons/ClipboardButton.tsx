import { PiCheck, PiClipboard } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

export function ClipboardButton({ url }: { url: string }) {
  const success = useSignal(false);

  return (
    <div
      aria-label="Copy URL of current page"
      class="device-detail-action-button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        success.value = true;
        setTimeout(() => {
          success.value = false;
        }, 2000);
      }}
      data-tooltip="Copy link"
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
        {!success.value && (
          <>
            <PiClipboard />
            <span class="device-detail-action-button-label">Link</span>
          </>
        )}
        {success.value && (
          <>
            <PiCheck />
            <span class="device-detail-action-button-label">Copied!</span>
          </>
        )}
      </span>
    </div>
  );
}
