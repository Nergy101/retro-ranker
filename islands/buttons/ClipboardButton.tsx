import { PiCheck, PiClipboard } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

export function ClipboardButton({ url }: { url: string }) {
  const success = useSignal(false);

  return (
    <div
      aria-label="Copy URL of current page"
      style={{
        display: "flex",
        justifyContent: "center"
      }}
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        success.value = true;
        setTimeout(() => {
          success.value = false;
        }, 2000);
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
        data-tooltip="Copy URL"
        data-placement="bottom"
      >
        {!success.value && (
          <>
            <PiClipboard /> Copy Link
          </>
        )}
        {success.value && (
          <>
            <PiCheck /> Copied!
          </>
        )}
      </span>
    </div>
  );
}
