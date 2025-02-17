import { PiGridNine, PiList, PiSquaresFour } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";

export function LayoutSelector(
  { activeLayout, initialPageSize }: {
    activeLayout: string;
    initialPageSize: number;
  },
) {
  const pageSize = useSignal(initialPageSize);

  const handlePageSizeChange = (e: Event) => {
    const newPageSize = parseInt((e.target as HTMLInputElement).value, 10);
    if (newPageSize >= 1 && newPageSize <= 100) {
      pageSize.value = newPageSize;
      const url = new URL(globalThis.location.href);
      url.searchParams.set("pageSize", pageSize.value.toString());
      globalThis.history.pushState({}, "", url.toString());
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const url = new URL(globalThis.location.href);
    url.searchParams.set("pageSize", pageSize.value.toString());
    globalThis.location.href = url.toString();
  };

  const setActiveLayout = (layout: string) => {
    const url = new URL(globalThis.location.href);
    url.searchParams.set("layout", layout);
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
        data-tooltip="Default View"
        data-placement="left"
        type="button"
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
        <PiList class="text-3xl" />
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
          <input
            style={{ padding: 0, margin: 0 }}
            type="number"
            min="1"
            max="100"
            value={pageSize.value}
            onInput={handlePageSizeChange}
            name="pageSize"
            aria-label="Page Size"
            aria-invalid={pageSize.value < 1 || pageSize.value > 100}
          />
        </form>
      </div>
    </div>
  );
}
