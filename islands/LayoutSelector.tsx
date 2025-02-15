import { PiGridNine, PiList, PiSquaresFour } from "@preact-icons/pi";

export function LayoutSelector({ activeLayout }: { activeLayout: string }) {
  const setActiveLayout = (layout: string) => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set("layout", layout);
    // Navigate to the updated URL
    globalThis.location.href = url.toString();
  };

  const getStyle = (layout: string) =>
    activeLayout === layout ? "var(--pico-primary)" : "var(--pico-text)";

  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
      <button
        data-tooltip="Normal View"
        data-placement="left"
        type="button"
        class="outline no-border"
        style={{
          color: getStyle("grid9"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() =>
          setActiveLayout("grid9")}
      >
        <PiGridNine />
      </button>
      <button
        data-tooltip="Detailed View"
        data-placement="left"
        type="button"
        class="outline no-border"
        style={{
          color: getStyle("grid4"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() => setActiveLayout("grid4")}
      >
        <PiSquaresFour />
      </button>
      <button
        data-tooltip="Quick View"
        data-placement="left"
        type="button"
        class="outline no-border"
        style={{
          color: getStyle("list"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() => setActiveLayout("list")}
      >
        <PiList />
      </button>
    </div>
  );
}
