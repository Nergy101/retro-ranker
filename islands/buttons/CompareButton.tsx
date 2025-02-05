import { PiGitDiff } from "@preact-icons/pi";

interface CompareButtonProps {
  deviceName: string;
}

export function CompareButton({ deviceName }: CompareButtonProps) {
  return (
    <a
      class="device-detail-action-button"
      style={{ textDecoration: "none" }}
      href={`/compare?devices=${deviceName}`}
      data-tooltip="Compare"
      data-placement="bottom"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          textDecoration: "none",
          cursor: "pointer",
          color: "var(--pico-color)",
        }}
        aria-label="Compare this device with another"
      >
        <PiGitDiff />
        <span class="device-detail-action-button-label">Compare</span>
      </div>
    </a>
  );
}
