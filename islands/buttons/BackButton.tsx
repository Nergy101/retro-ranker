import { PiArrowLeft } from "@preact-icons/pi";

export function BackButton() {
  return (
    <button
      type="button"
      class="back-button"
      data-tooltip="Go back"
      data-placement="right"
      onClick={() => {
        globalThis.history.back();
      }}
    >
      <PiArrowLeft />
    </button>
  );
}
