import { PiCheck, PiClipboard } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

export function ClipboardButton({ url }: { url: string }) {
  const success = useSignal(false);

  return (
    <button
      aria-label="Copy URL of current page"
      class={success.value ? "secondary" : "secondary"}
      style={{
        display: "flex",
        justifyContent: "center",
        borderRadius: 0,
      }}
      data-tooltip="Copy URL"
      data-placement="bottom"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        success.value = true;
        setTimeout(() => {
          success.value = false;
        }, 1000);
      }}
    >
      {!success.value && <PiClipboard />}
      {success.value && <PiCheck />}
    </button>
  );
}
