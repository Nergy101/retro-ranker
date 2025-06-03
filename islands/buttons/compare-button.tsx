import { PiGitDiff } from "@preact-icons/pi";

interface CompareButtonProps {
  deviceName: string;
}

export default function CompareButton({ deviceName }: CompareButtonProps) {
  const getIconSizeBasedOnDevice = () => {
    if (globalThis.innerWidth < 768) {
      return 32;
    }
    return 16;
  };
  return (
    <a
      class="device-detail-action-button"
      style={{ textDecoration: "none" }}
      href={`/compare?devices=${deviceName}`}
      data-tooltip="Compare"
      data-placement="right"
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
        <PiGitDiff size={getIconSizeBasedOnDevice()} />
        <span class="device-detail-action-button-label">Compare</span>
      </div>
    </a>
  );
}
