import { PiGitDiff } from "@preact-icons/pi";

interface CompareButtonProps {
  deviceName: string;
}

export function CompareButton({ deviceName }: CompareButtonProps) {
  return (
    <a
      aria-label="Compare this device with another"
      style={{
        display: "flex",
        justifyContent: "center",
        borderRadius: 0,
        alignItems: "center",
        gap: "0.5rem",
      }}
      data-tooltip="Compare"
      data-placement="bottom"
      href={`/compare?devices=${deviceName}`}
    >
      <PiGitDiff /> Compare
    </a>
  );
}
