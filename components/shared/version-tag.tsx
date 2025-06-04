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

  const lastSynchronized = () => {
    if (friendlyVersionDate === new Date().toISOString().split("T")[0]) {
      return "Synchronized Today at 00:00 UTC";
    }
    return `Synchronized ${friendlyVersionDate}T00:00 UTC`;
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
          padding: "0.5rem",
          margin: "0.5rem",
          textDecoration: "none",
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
