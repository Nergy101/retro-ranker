import { PiClock, PiPlugs, PiPlugsConnected } from "@preact-icons/pi";
import { useState } from "preact/hooks";

export function VersionTag() {
  const [version, _] = useState<string>(
    Deno.env.get("DEPLOY_VERSION") ??
      Deno.readTextFileSync("static/version.txt") ??
      "no version",
  );

  const versionDate = version.split("-")[0];
  const friendlyVersionDate = versionDate.slice(0, 4) + "-" +
    versionDate.slice(4, 6) + "-" + versionDate.slice(6);
  const versionHash = version.split("-")[1];
  const versionRef = version.split("-")[2];

  const iconSize = 24;

  const lastSynchronized = () => {
    if (friendlyVersionDate === new Date().toISOString().split("T")[0]) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span data-tooltip="Synced Today">
            <PiPlugsConnected size={iconSize} />
          </span>
          <span data-tooltip="At 00:00 UTC">
            <PiClock size={iconSize} />
          </span>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span data-tooltip={`Synced ${friendlyVersionDate}`}>
          <PiPlugs size={iconSize} />
        </span>
        <span data-tooltip="At 00:00 UTC">
          <PiClock size={iconSize} />
        </span>
      </div>
    );
  };

  const versionTooltip = () => {
    if (versionDate && versionHash && versionRef) {
      return `Build: ${versionDate} ${versionHash} ${versionRef}`;
    }
    if (versionDate && versionHash) {
      return `Build: ${versionDate} ${versionHash}`;
    }
    if (versionDate) {
      return `Build: ${versionDate}`;
    }

    return "No build version";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <small
        style={{
          background: "var(--pico-card-background-color-darker)",
          color: "var(--pico-primary)",
          border: "1px solid var(--pico-primary)",
          borderRadius: "var(--pico-border-radius)",
          margin: "0.5rem",
          padding: "0.25rem",
        }}
        data-tooltip={versionTooltip()}
        data-placement="bottom"
        aria-label={`version: ${versionTooltip()}`}
      >
        {lastSynchronized()}
      </small>
    </div>
  );
}
