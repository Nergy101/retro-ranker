import { PiCheck, PiClipboard } from "@preact-icons/pi";
import { useState } from "preact/hooks";

export function ClipboardButton({ url }: { url: string }) {
  const [success, setSuccess] = useState(false);
  const getIconSizeBasedOnDevice = () => {
    if (globalThis.innerWidth < 768) {
      return 32;
    }
    return 16;
  };

  return (
    <div
      aria-label="Copy URL of current page"
      class="device-detail-action-button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      }}
      data-tooltip="Copy link"
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
        {!success && (
          <>
            <PiClipboard size={getIconSizeBasedOnDevice()} />
            <span class="device-detail-action-button-label">Link</span>
          </>
        )}
        {success && (
          <>
            <PiCheck size={getIconSizeBasedOnDevice()} />
            <span class="device-detail-action-button-label">Copied!</span>
          </>
        )}
      </span>
    </div>
  );
}
