import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import { UmamiService } from "../../data/frontend/services/umami/umami.service.ts";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  initialSort: string;
  initialFilter: string;
  initialTags: TagModel[];
}

export function DeviceSearchForm(
  {
    initialSearch,
    initialCategory,
    initialPage,
    initialSort,
    initialFilter,
    initialTags,
  }: DeviceSearchFormProps,
) {
  const umamiService = UmamiService.getInstance();
  const searchQuery = useSignal(initialSearch);
  const category = useSignal(initialCategory);
  const sort = useSignal(initialSort);
  const filter = useSignal(initialFilter);
  const page = useSignal(initialPage);

  const viewportWidth = useSignal(globalThis.innerWidth);

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

  const getSearchPlaceholder = () => {
    const random = Math.random();
    const placeholders = [
      "Name, Brand or OS...",
      "Try 'Anbernic'...",
      "Try 'Miyoo'...",
      "Try 'Pocket'...",
      "Try 'Flip'...",
      "Try 'Plus'...",
      "Try 'Mini'...",
      "Try 'Android'...",
      "Try 'Batocera'...",
    ];
    return placeholders[Math.floor(random * placeholders.length)];
  };

  const submitForm = async () => {
    await umamiService.sendEvent("search", {
      search: searchQuery.value,
      category: category.value,
      sort: sort.value,
      filter: filter.value,
      page: page.value,
      tags: initialTags.map((t) => t.slug).join(","),
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

  if (viewportWidth.value <= 1024) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <form
          style={{ padding: "0" }}
          method="get"
          class="device-search-form-mobile"
          f-client-nav={false}
        >
          <input
            name="search"
            type="search"
            placeholder={getSearchPlaceholder()}
            value={searchQuery.value}
            aria-label="Search devices"
          />
          <input
            style={{ display: "none" }}
            name="page"
            type="number"
            value={page}
          />
          <input
            style={{ display: "none" }}
            name="tags"
            type="text"
            value={initialTags.map((t) => t.slug).join(",")}
          />
          <div>
            <select
              name="sort"
              aria-label="Sort by"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="new-arrivals">Newest to Oldest</option>
              <option value="high-low-price">Expensive to Cheapest</option>
              <option value="low-high-price">Cheapest to Expensive</option>
              <option value="alphabetical">A to Z</option>
              <option value="reverse-alphabetical">Z to A</option>
            </select>
          </div>
          <input type="submit" value="Search" style={{ borderRadius: "2em" }} />
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <form
        style={{ padding: "0" }}
        role="search"
        method="get"
        class="device-search-form"
        f-client-nav={false}
      >
        <input
          name="search"
          type="search"
          placeholder={getSearchPlaceholder()}
          value={searchQuery.value}
          aria-label="Search devices"
        />
        <input
          style={{ display: "none" }}
          name="page"
          type="number"
          value={page}
        />
        <input
          style={{ display: "none" }}
          name="tags"
          type="text"
          value={initialTags.map((t) => t.slug).join(",")}
        />
        <select
          name="sort"
          aria-label="Sort by"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="new-arrivals">Newest to Oldest</option>
          <option value="high-low-price">Expensive to Cheapest</option>
          <option value="low-high-price">Cheapest to Expensive</option>
          <option value="alphabetical">A to Z</option>
          <option value="reverse-alphabetical">Z to A</option>
        </select>
        <input type="submit" value="Search" aria-label="Search" />
      </form>
    </div>
  );
}
