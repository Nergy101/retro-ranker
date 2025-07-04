import { useEffect, useState } from "preact/hooks";
import { TagModel } from "@data/frontend/models/tag.model.ts";
import { UmamiService } from "@data/frontend/services/umami/umami.service.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  initialSort: string;
  initialFilter: string;
  initialTags: TagModel[];
  translations: Record<string, string>;
}

export function DeviceSearchForm(
  {
    initialSearch,
    initialCategory,
    initialPage,
    initialSort,
    initialFilter,
    initialTags,
    translations,
  }: DeviceSearchFormProps,
) {
  const umamiService = UmamiService.getInstance();
  const [searchQuery, _setSearchQuery] = useState(initialSearch);
  const [category, _setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [filter, _setFilter] = useState(initialFilter);
  const [page, _setPage] = useState(initialPage);

  const [viewportWidth, setViewportWidth] = useState(globalThis.innerWidth);

  const handleSortChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setSort(select.value);
    // Update the page input value explicitly
    const pageInput = select.form?.querySelector(
      'input[name="page"]',
    ) as HTMLInputElement;

    if (pageInput) {
      pageInput.value = page.toString();
    }

    submitForm();
  };

  const getSearchPlaceholder = () => {
    const random = Math.random();
    const placeholders = [
      TranslationPipe(translations, "search.placeholder.general"),
      TranslationPipe(translations, "search.placeholder.anbernic"),
      TranslationPipe(translations, "search.placeholder.miyoo"),
      TranslationPipe(translations, "search.placeholder.pocket"),
      TranslationPipe(translations, "search.placeholder.flip"),
      TranslationPipe(translations, "search.placeholder.plus"),
      TranslationPipe(translations, "search.placeholder.mini"),
      TranslationPipe(translations, "search.placeholder.android"),
      TranslationPipe(translations, "search.placeholder.batocera"),
    ];
    return placeholders[Math.floor(random * placeholders.length)];
  };

  const submitForm = async () => {
    await umamiService.sendEvent("search", {
      search: searchQuery,
      category: category,
      sort: sort,
      filter: filter,
      page: page,
      tags: initialTags.map((t) => t.slug).join(","),
    });

    if (viewportWidth < 500) {
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
      setViewportWidth(globalThis.innerWidth);
    };

    // Add event listener
    globalThis.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  });

  if (viewportWidth <= 1024) {
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
            value={searchQuery}
            aria-label={TranslationPipe(translations, "search.ariaLabel")}
            class="tag-search-input"
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
              aria-label={TranslationPipe(translations, "sort.ariaLabel")}
              value={sort}
              onChange={handleSortChange}
            >
              <option value="new-arrivals">
                {TranslationPipe(translations, "sort.newest")}
              </option>
              <option value="high-low-price">
                {TranslationPipe(translations, "sort.expensiveToCheapest")}
              </option>
              <option value="low-high-price">
                {TranslationPipe(translations, "sort.cheapestToExpensive")}
              </option>
              <option value="highly-ranked">
                {TranslationPipe(translations, "sort.highestRanking")}
              </option>
              <option value="alphabetical">
                {TranslationPipe(translations, "sort.alphabetical")}
              </option>
              <option value="reverse-alphabetical">
                {TranslationPipe(translations, "sort.reverse")}
              </option>
            </select>
          </div>
          <input
            type="submit"
            value={TranslationPipe(translations, "search.button")}
            style={{ borderRadius: "2em" }}
          />
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
          value={searchQuery}
          aria-label={TranslationPipe(translations, "search.ariaLabel")}
          class="tag-search-input"
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
          aria-label={TranslationPipe(translations, "sort.ariaLabel")}
          value={sort}
          onChange={handleSortChange}
          class="tag-search-input"
        >
          <option value="new-arrivals">
            {TranslationPipe(translations, "sort.newest")}
          </option>
          <option value="high-low-price">
            {TranslationPipe(translations, "sort.expensive")}
          </option>
          <option value="low-high-price">
            {TranslationPipe(translations, "sort.cheapest")}
          </option>
          <option value="highly-ranked">
            {TranslationPipe(translations, "sort.highest")}
          </option>
          <option value="alphabetical">
            {TranslationPipe(translations, "sort.alphabetical")}
          </option>
          <option value="reverse-alphabetical">
            {TranslationPipe(translations, "sort.reverse")}
          </option>
        </select>
        <input
          type="submit"
          value={TranslationPipe(translations, "search.button")}
          aria-label={TranslationPipe(translations, "search.button")}
        />
      </form>
    </div>
  );
}
