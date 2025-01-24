import { PiGitDiff } from "@preact-icons/pi";

interface CompareButtonProps {
  deviceName: string;
}

export function CompareButton({ deviceName }: CompareButtonProps) {
  return (
    <a
      aria-label="Compare this device with another"
      role="button"
      style={{ display: "flex", justifyContent: "center", borderRadius: 0 }}
      data-tooltip="Compare"
      data-placement="bottom"
      href={`/compare?devices=${deviceName}`}
    >
      <PiGitDiff />
    </a>
  );
} 