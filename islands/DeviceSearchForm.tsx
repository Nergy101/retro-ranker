import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { UmamiService } from "../services/umami/umami.service.ts";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  initialSort: string;
  initialFilter: string;
}

export function DeviceSearchForm(
  { initialSearch, initialCategory, initialPage, initialSort, initialFilter }:
    DeviceSearchFormProps,
) {
  const umamiService = UmamiService.getInstance();
  const searchQuery = useSignal(initialSearch);
  const category = useSignal(initialCategory);
  const sort = useSignal(initialSort);
  const filter = useSignal(initialFilter);
  const page = useSignal(initialPage);

  const viewportWidth = useSignal(globalThis.innerWidth);

  const handleCategoryChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    page.value = 1;
    category.value = select.value;

    // Update the page input value explicitly
    const pageInput = select.form?.querySelector(
      'input[name="page"]',
    ) as HTMLInputElement;
    if (pageInput) {
      pageInput.value = page.value.toString();
    }

    submitForm();
  };

  const handleSortChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    sort.value = select.value;
    // Update the page input value explicitly
    const pageInput = select.form?.querySelector(
      'input[name="page"]',
    ) as HTMLInputElement;
    if (pageInput) {
      pageInput.value = page.value.toString();
    }

    submitForm();
  };

  const handleFilterChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    filter.value = select.value;
    // Update the page input value explicitly
    const pageInput = select.form?.querySelector(
      'input[name="page"]',
    ) as HTMLInputElement;
    if (pageInput) {
      pageInput.value = page.value.toString();
    }

    submitForm();
  };

  const submitForm = async () => {
    await umamiService.sendEvent("search", {
      search: searchQuery.value,
      category: category.value,
      sort: sort.value,
      filter: filter.value,
      page: page.value,
    });

    if (viewportWidth.value < 500) {
      const form = document.getElementsByClassName(
        "device-search-form-mobile",
      )[0] as HTMLFormElement;
      form?.submit();
    } else {
      const form = document.getElementsByClassName(
        "device-search-form",
      )[0] as HTMLFormElement;

      form?.submit();
    }
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
          placeholder="Name, Brand or OS..."
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
          <option value="all">Price</option>
          <option value="low">Budget</option>
          <option value="mid">Mid-Range</option>
          <option value="high">High-End</option>
        </select>
        <div>
          <select
            name="sort"
            aria-label="Sort by"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="all">Sort</option>
            <option value="highly-rated">Highly Rated</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
          <select
            name="filter"
            aria-label="Filter by"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Filter</option>
            <option value="upcoming">Upcoming</option>
            <option value="personal-picks">Personal Picks</option>
          </select>
        </div>
        <input type="submit" value="Search" style={{ borderRadius: "2em" }} />
      </form>
    );
  }

  return (
    <form role="search" method="get" class="device-search-form">
      <input
        name="search"
        type="search"
        placeholder="Name, Brand or OS..."
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
        <option value="all">Price</option>
        <option value="low">Budget</option>
        <option value="mid">Mid-Range</option>
        <option value="high">High-End</option>
      </select>
      <select
        name="sort"
        aria-label="Sort by"
        value={sort}
        onChange={handleSortChange}
      >
        <option value="all">Sort</option>
        <option value="highly-rated">Highly Rated</option>
        <option value="new-arrivals">New Arrivals</option>
      </select>
      <select
        name="filter"
        aria-label="Filter by"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="all">Filter</option>
        <option value="upcoming">Upcoming</option>
        <option value="personal-picks">Personal Picks</option>
      </select>
      <input type="submit" value="Search" />
    </form>
  );
}
