import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { FilterTag } from "../../components/shared/FilterTag.tsx";
import { TagModel } from "../../data/models/tag.model.ts";
import { UmamiService } from "../../services/umami/umami.service.ts";

interface DeviceSearchFormProps {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  initialSort: string;
  initialFilter: string;
  initialTags: TagModel[];
  defaultTags: TagModel[];
}

export function DeviceSearchForm(
  {
    initialSearch,
    initialCategory,
    initialPage,
    initialSort,
    initialFilter,
    initialTags,
    defaultTags,
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

  const getTagsHref = (
    tags: TagModel[],
    tag: TagModel,
    type: "add" | "remove",
  ) => {
    // if a tag with the same type is present, filter it out and insert the new one
    let tagSlugs = "";
    let filteredTags = [];

    if (type === "add") {
      filteredTags = tags.filter((t) => t.type !== tag.type)
        .concat(tag)
        .filter((t) => t.slug !== "");
    } else {
      filteredTags = tags.filter((t) => t.type !== tag.type).filter((t) =>
        t.slug !== ""
      );
    }

    tagSlugs = filteredTags.map((t) => t.slug).join(",");

    if (tagSlugs != "") {
      return `/devices?tags=${tagSlugs}&sort=${sort.value}&filter=${filter.value}&page=${page.value}&search=${searchQuery.value}`;
    }

    return `/devices?sort=${sort.value}&filter=${filter.value}&page=${page.value}&search=${searchQuery.value}`;
  };

  const renderTags = () => {
    return (
      <>
        {initialTags.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span>Filtered on:</span>
            {initialTags.map((tag) => (
              <FilterTag
                tag={tag}
                type="remove"
                href={getTagsHref(
                  initialTags,
                  tag,
                  "remove",
                )}
              />
            ))}
          </div>
        )}
        <div class="tags">
          {defaultTags.map((tag) => {
            return (
              <FilterTag
                tag={tag}
                type={"add"}
                href={getTagsHref(initialTags, tag, "add")}
              />
            );
          })}
        </div>
      </>
    );
  };

  if (viewportWidth.value < 800) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <form
          method="get"
          class="device-search-form-mobile"
          f-client-nav={false}
        >
          <input
            name="search"
            type="search"
            placeholder="Name, Brand or OS..."
            value={searchQuery.value}
            aria-label="Search devices"
          />
          <input
            style="display: none;"
            name="page"
            type="number"
            value={page}
          />
          <input
            style="display: none;"
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
              <option value="all">Sort</option>
              <option value="highly-rated">Ranking</option>
              <option value="new-arrivals">New arrivals</option>
              <option value="alphabetical">A - Z</option>
            </select>
          </div>
          <input type="submit" value="Search" style={{ borderRadius: "2em" }} />
        </form>

        {renderTags()}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <form
        role="search"
        method="get"
        class="device-search-form"
        f-client-nav={false}
      >
        <input
          name="search"
          type="search"
          placeholder="Name, Brand or OS..."
          value={searchQuery.value}
          aria-label="Search devices"
        />
        <input
          style="display: none;"
          name="page"
          type="number"
          value={page}
        />
        <input
          style="display: none;"
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
          <option value="all">Sort</option>
          <option value="highly-rated">Ranking</option>
          <option value="new-arrivals">New arrivals</option>
          <option value="alphabetical">A - Z</option>
        </select>
        <input type="submit" value="Search" />
      </form>

      {renderTags()}
    </div>
  );
}
