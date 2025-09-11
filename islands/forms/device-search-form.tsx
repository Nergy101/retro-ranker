import { useEffect, useState } from "preact/hooks";
import { TagModel } from "../../data/frontend/models/tag.model.ts";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  _initialPage: number;
  initialSort: string;
  initialFilter: string;
  _initialTags: TagModel[];
}

export function DeviceSearchForm(
  {
    initialSearch,
    initialCategory,
    _initialPage,
    initialSort,
    initialFilter,
    _initialTags,
  }: DeviceSearchFormProps,
) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [filter, setFilter] = useState(initialFilter);
  const [viewportWidth, setViewportWidth] = useState(globalThis.innerWidth);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const url = new URL(globalThis.location.href);
    url.searchParams.set("search", formData.get("search") as string || "");
    url.searchParams.set(
      "category",
      formData.get("category") as string || "all",
    );
    url.searchParams.set(
      "sort",
      formData.get("sort") as string || "alphabetical",
    );
    url.searchParams.set("filter", formData.get("filter") as string || "all");
    url.searchParams.set("page", "1");

    globalThis.location.href = url.toString();
  };

  const handleSortChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setSort(select.value);

    const url = new URL(globalThis.location.href);
    url.searchParams.set("sort", select.value);
    url.searchParams.set("page", "1");

    globalThis.location.href = url.toString();
  };

  const handleFilterChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setFilter(select.value);

    const url = new URL(globalThis.location.href);
    url.searchParams.set("filter", select.value);
    url.searchParams.set("page", "1");

    globalThis.location.href = url.toString();
  };

  const getSearchPlaceholder = () => {
    const random = Math.random();
    const placeholders = [
      "Search devices...",
      "Search Anbernic devices...",
      "Search Miyoo devices...",
      "Search Pocket devices...",
      "Search Flip devices...",
      "Search Plus devices...",
      "Search Mini devices...",
      "Search Android devices...",
      "Search Batocera devices...",
    ];
    return placeholders[Math.floor(random * placeholders.length)];
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(globalThis.innerWidth);
    };

    globalThis.addEventListener("resize", handleResize);
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  });

  if (viewportWidth <= 1024) {
    return (
      <div class="device-search-container-mobile">
        <form onSubmit={handleSubmit} class="device-search-form-mobile-clean">
          {/* Row 1: Search input and button */}
          <div class="search-row-mobile">
            <div class="search-input-group-mobile">
              <input
                type="text"
                name="search"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onInput={(e) =>
                  setSearchQuery((e.target as HTMLInputElement).value)}
                class="search-input-mobile-clean"
              />
              <button
                type="submit"
                class="search-button-mobile-clean"
                aria-label="Search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Row 2: Sort and Filter dropdowns */}
          <div class="controls-row-mobile">
            <div class="control-group-mobile">
              <label for="sort-select-mobile" class="control-label-mobile">
                Sort by:
              </label>
              <select
                id="sort-select-mobile"
                name="sort"
                value={sort}
                onChange={handleSortChange}
                class="control-select-mobile"
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="reverse-alphabetical">
                  Reverse Alphabetical
                </option>
                <option value="high-low-price">Price: High to Low</option>
                <option value="low-high-price">Price: Low to High</option>
                <option value="highly-ranked">Highly Ranked</option>
                <option value="new-arrivals">New Arrivals</option>
              </select>
            </div>

            <div class="control-group-mobile">
              <label for="filter-select-mobile" class="control-label-mobile">
                Filter:
              </label>
              <select
                id="filter-select-mobile"
                name="filter"
                value={filter}
                onChange={handleFilterChange}
                class="control-select-mobile"
              >
                <option value="all">All Devices</option>
                <option value="upcoming">Upcoming</option>
                <option value="personal-picks">Personal Picks</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div class="device-search-container">
      <form onSubmit={handleSubmit} class="device-search-form-clean">
        {/* Row 1: Search input and button */}
        <div class="search-row">
          <div class="search-input-group">
            <input
              type="text"
              name="search"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onInput={(e) =>
                setSearchQuery((e.target as HTMLInputElement).value)}
              class="search-input-clean"
            />
            <button
              type="submit"
              class="search-button-clean"
              aria-label="Search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Sort and Filter dropdowns */}
        <div class="controls-row">
          <div class="control-group">
            <label for="sort-select" class="control-label">Sort by:</label>
            <select
              id="sort-select"
              name="sort"
              value={sort}
              onChange={handleSortChange}
              class="control-select"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="reverse-alphabetical">Reverse Alphabetical</option>
              <option value="high-low-price">Price: High to Low</option>
              <option value="low-high-price">Price: Low to High</option>
              <option value="highly-ranked">Highly Ranked</option>
              <option value="new-arrivals">New Arrivals</option>
            </select>
          </div>

          <div class="control-group">
            <label for="filter-select" class="control-label">Filter:</label>
            <select
              id="filter-select"
              name="filter"
              value={filter}
              onChange={handleFilterChange}
              class="control-select"
            >
              <option value="all">All Devices</option>
              <option value="upcoming">Upcoming</option>
              <option value="personal-picks">Personal Picks</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
