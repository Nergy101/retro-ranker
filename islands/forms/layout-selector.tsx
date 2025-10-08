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

  const getActiveClass = (layout: string) =>
    activeLayout === layout ? "layout-active" : "";

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "0.5rem",
          backgroundColor: "var(--pico-card-background-color-darker)",
          borderRadius: "var(--pico-border-radius)",
          padding: "0.5rem",
          border: "1px solid var(--pico-muted-border-color)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveLayout("grid9")}
          className={getActiveClass("grid9")}
          style={{
            marginBottom: 0,
            background: "transparent",
            cursor: "pointer",
            width: "5rem",
            color: activeLayout === "grid9"
              ? "var(--pico-primary)"
              : "var(--pico-text)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiGridNine size={20} />
            <span>Default</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveLayout("grid4")}
          className={getActiveClass("grid4")}
          style={{
            marginBottom: 0,
            background: "transparent",
            cursor: "pointer",
            width: "5rem",
            color: activeLayout === "grid4"
              ? "var(--pico-primary)"
              : "var(--pico-text)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiSquaresFour size={20} />
            <span>Detailed</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveLayout("list")}
          className={getActiveClass("list")}
          style={{
            marginBottom: 0,
            background: "transparent",
            cursor: "pointer",
            width: "5rem",
            color: activeLayout === "list"
              ? "var(--pico-primary)"
              : "var(--pico-text)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              minWidth: "3rem",
            }}
          >
            <PiList size={20} />
            <span>List</span>
          </div>
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
          flex: 1,
        }}
      >
        <label htmlFor="pageSize" style={{ flex: 2 }}>
          Items per page:
        </label>
        <select
          style={{ flex: 1, minWidth: "5rem" }}
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={4}>4</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
