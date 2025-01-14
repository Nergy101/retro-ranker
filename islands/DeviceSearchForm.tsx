import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
}

export function DeviceSearchForm(
  { initialSearch, initialCategory, initialPage }: DeviceSearchFormProps,
) {
  const searchQuery = useSignal(initialSearch);
  const category = useSignal(initialCategory);
  const page = useSignal(initialPage);
  const viewportWidth = useSignal(globalThis.innerWidth);

  const handleCategoryChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    category.value = select.value;
    page.value = 1; // Reset to first page when changing category
    select.form?.submit();
  };

  useEffect(() => {
    const handleResize = () => {
      viewportWidth.value = globalThis.innerWidth;
    };

    // Add event listener
    globalThis.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  }, []);

  if (viewportWidth.value < 500) {
    return (
      <form method="get" class="device-search-form-mobile">
        <input
          name="search"
          type="search"
          placeholder="Search devices..."
          value={searchQuery}
          aria-label="Search devices"
        />
        <input
          style="display: none;"
          name="page"
          type="number"
          value={page}
        />
        <select
          name="category"
          aria-label="Filter by category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="high-end">High-End</option>
        </select>
        <input type="submit" value="Search" style={{ borderRadius: "2em" }} />
      </form>
    );
  }

  return (
    <form role="search" method="get" class="device-search-form">
      <input
        name="search"
        type="search"
        placeholder="Search devices..."
        value={searchQuery}
        aria-label="Search devices"
      />
      <input
        style="display: none;"
        name="page"
        type="number"
        value={page}
      />
      <select
        name="category"
        aria-label="Filter by category"
        value={category}
        onChange={handleCategoryChange}
      >
        <option value="all">All</option>
        <option value="budget">Budget</option>
        <option value="mid-range">Mid-Range</option>
        <option value="high-end">High-End</option>
      </select>
      <input type="submit" value="Search" />
    </form>
  );
}
