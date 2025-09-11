import { PiGridNine, PiList, PiSquaresFour } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export function LayoutSelector(
  { activeLayout, initialPageSize, defaultPageSize: _defaultPageSize }: {
    activeLayout: string;
    initialPageSize: number;
    defaultPageSize: number;
  },
) {
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    const layout = localStorage.getItem("preferredLayout");
    if (layout && layout !== activeLayout) {
      setActiveLayout(layout);
    }
  });

  const handlePageSizeChange = (e: Event) => {
    const newPageSize = parseInt((e.target as HTMLSelectElement).value, 10);
    setPageSize(newPageSize);

    const url = new URL(globalThis.location.href);
    url.searchParams.set("pageSize", newPageSize.toString());
    globalThis.location.href = url.toString();
  };

  const setActiveLayout = (layout: string) => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set("layout", layout);
    localStorage.setItem("preferredLayout", layout);
    globalThis.location.href = url.toString();
  };

  const getStyle = (layout: string) =>
    activeLayout === layout ? "var(--pico-primary)" : "var(--pico-text)";

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => setActiveLayout("grid9")}
          style={{
            color: getStyle("grid9"),
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          data-tooltip="Grid 9 layout"
        >
          <PiGridNine size={20} />
        </button>
        <button
          type="button"
          onClick={() => setActiveLayout("grid4")}
          style={{
            color: getStyle("grid4"),
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          data-tooltip="Grid 4 layout"
        >
          <PiSquaresFour size={20} />
        </button>
        <button
          type="button"
          onClick={() => setActiveLayout("list")}
          style={{
            color: getStyle("list"),
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          data-tooltip="List layout"
        >
          <PiList size={20} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label htmlFor="pageSize">Items per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
