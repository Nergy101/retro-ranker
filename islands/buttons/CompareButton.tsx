import { PiGitDiff } from "@preact-icons/pi";

interface CompareButtonProps {
  deviceName: string;
}

export function CompareButton({ deviceName }: CompareButtonProps) {
  return (
    <div
      aria-label="Compare this device with another"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <a
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          borderBottom: "none",
          textDecoration: "none",
          cursor: "pointer",
          color: "var(--pico-color)",
        }}
        data-tooltip="Compare"
        data-placement="bottom"
        href={`/compare?devices=${deviceName}`}
      >
        <PiGitDiff /> Compare
      </a>
    </div>
  );
}
