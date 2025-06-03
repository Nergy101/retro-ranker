import { PiGridNine, PiList, PiSquaresFour } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";

export default function LayoutSelector(
  { activeLayout, initialPageSize, defaultPageSize }: {
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
    url.searchParams.set("pageSize", pageSize.toString());
    globalThis.location.href = url.toString();
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const url = new URL(globalThis.location.href);
    url.searchParams.set("pageSize", pageSize.toString());
    globalThis.location.href = url.toString();
  };

  const setActiveLayout = (layout: string) => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set("layout", layout);
    localStorage.setItem("preferredLayout", layout);
    // Navigate to the updated URL
    globalThis.location.href = url.toString();
  };

  const getStyle = (layout: string) =>
    activeLayout === layout ? "var(--pico-primary)" : "var(--pico-text)";

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <button
        data-tooltip="List View"
        data-placement="left"
        type="button"
        aria-label="List View"
        class="outline no-border"
        style={{
          color: getStyle("list"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() => setActiveLayout("list")}
      >
        <PiList class="text-3xl" />
      </button>
      <button
        data-tooltip="Small View"
        data-placement="left"
        type="button"
        aria-label="Small View"
        class="outline no-border"
        style={{
          color: getStyle("grid9"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() => setActiveLayout("grid9")}
      >
        <PiGridNine class="text-3xl" />
      </button>
      <button
        data-tooltip="Detailed View"
        data-placement="left"
        type="button"
        aria-label="Detailed View"
        class="outline no-border"
        style={{
          color: getStyle("grid4"),
          cursor: "pointer",
          margin: 0,
          padding: 0,
        }}
        onClick={() => setActiveLayout("grid4")}
      >
        <PiSquaresFour class="text-3xl" />
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit}>
          <select
            style={{
              textAlign: "center",
              width: "auto",
            }}
            value={pageSize}
            onChange={handlePageSizeChange}
            name="pageSize"
            aria-label="Page Size"
          >
            <option value={defaultPageSize}>{defaultPageSize}</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </form>
      </div>
    </div>
  );
}
