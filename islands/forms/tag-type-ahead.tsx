import { PiTag } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";
import { FilterTag } from "../../components/shared/filter-tag.tsx";
import {
  TAG_FRIENDLY_NAMES,
  TagModel,
} from "../../data/frontend/models/tag.model.ts";

interface TagTypeaheadProps {
  allTags: TagModel[];
  initialSelectedTags: TagModel[];
  baseUrl: string;
}

export function TagTypeahead(
  { allTags, initialSelectedTags, baseUrl }: TagTypeaheadProps,
) {
  const [selectedTags, _setSelectedTags] = useState<TagModel[]>(
    initialSelectedTags,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [viewportWidth, setViewportWidth] = useState(globalThis.innerWidth);

  const getComputedPlaceholder = () => {
    if (viewportWidth >= 768 && viewportWidth <= 1024) {
      return "Search...";
    }
    return "Search for tags...";
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

  // Use a signal for currentSearchParams to keep it in sync with the browser location
  const [currentSearchParams, setCurrentSearchParams] = useState<
    URLSearchParams | undefined
  >(
    undefined,
  );

  useEffect(() => {
    const updateSearchParams = () => {
      setCurrentSearchParams(
        new URLSearchParams(
          globalThis.location.search,
        ),
      );
    };
    globalThis.addEventListener("popstate", updateSearchParams);
    globalThis.addEventListener("pushstate", updateSearchParams);
    globalThis.addEventListener("replacestate", updateSearchParams);
    updateSearchParams();
    return () => {
      globalThis.removeEventListener("popstate", updateSearchParams);
      globalThis.removeEventListener("pushstate", updateSearchParams);
      globalThis.removeEventListener("replacestate", updateSearchParams);
    };
  });

  const filteredTags = [
    ...new Set(
      allTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    ),
  ];

  const getFriendlyTagName = (type: string) => {
    return TAG_FRIENDLY_NAMES[type as keyof typeof TAG_FRIENDLY_NAMES] ?? type;
  };
  const getTagsHref = (
    tag: TagModel,
    type: "add" | "remove",
    currentSearchParams: URLSearchParams,
    selectedTagsList: TagModel[],
  ): URL => {
    let tagSlugs = "";
    let filteredTags = [];

    if (type === "add") {
      filteredTags = selectedTagsList.filter((t) => t.type !== tag.type)
        .concat(tag)
        .filter((t) => t.slug !== "");
    } else {
      filteredTags = selectedTagsList.filter((t) => t.type !== tag.type)
        .filter((t) => t.slug !== "");
    }

    tagSlugs = filteredTags.map((t) => t.slug).join(",");

    const newSearchParams = new URLSearchParams(currentSearchParams);

    if (tagSlugs != "") {
      newSearchParams.set("tags", tagSlugs);
    } else {
      newSearchParams.delete("tags");
    }

    const url = new URL(`${baseUrl}/devices`);
    url.search = newSearchParams.toString().replaceAll("%2C", ",");
    return url;
  };

  const groupedTags = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, TagModel[]>);

  // First sort the tag types according to the predefined order
  const sortedGroupedTags = Object.fromEntries(
    Object.entries(groupedTags).sort(([a], [b]) => {
      const order = [
        "formFactor",
        "price",
        "screenType",
        "releaseDate",
        "os",
        "brand",
        "personalPick",
      ];
      return order.indexOf(a) - order.indexOf(b);
    }).map(([type, tags]) => {
      if (type === "price") {
        // pick out the 1 entry with ?? in the name and put that before the others
        const qTag = tags.find((t) => t.name.includes("??"));
        if (qTag) {
          tags = tags.filter((t) => t !== qTag);
          tags.unshift(qTag);
        }
        return [type, tags];
      }

      if (type === "releaseDate") {
        // sort by release year, newest to oldest
        tags = tags.sort((a, b) => b.name.localeCompare(a.name));
        return [type, tags];
      }

      // Then sort the tags within each type alphabetically by name
      const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
      return [type, sortedTags];
    }),
  );

  return (
    <div>
      <div class="selected-tags-container">
        {selectedTags.length > 0
          ? (
            <>
              <h4 style={{ textAlign: "center" }}>
                Selected tags
              </h4>
              <div class="tags">
                {selectedTags.map((tag) => (
                  <FilterTag
                    key={tag.slug}
                    tag={tag}
                    type="remove"
                    href={getTagsHref(
                      tag,
                      "remove",
                      currentSearchParams ?? new URLSearchParams(),
                      selectedTags,
                    )}
                  />
                ))}
              </div>
            </>
          )
          : (
            <div class="empty-selection">
              <span>Select tags below to filter.</span>
            </div>
          )}
      </div>

      <div class="search-container">
        <input
          type="search"
          placeholder={getComputedPlaceholder()}
          value={searchTerm}
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
          class="tag-search-input"
        />
      </div>

      <div class="filter-categories">
        {Object.entries(sortedGroupedTags).map(([type, tags]) => (
          <details
            key={type}
            class="filter-category"
            open={searchTerm.length > 0}
          >
            <summary class="category-header">
              <span
                class="category-icon"
                style={{
                  display: "inline-flex",
                  alignItems: "space-between",
                  gap: "0.4em",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PiTag />
                </span>
                <span
                  class="category-label"
                  style={{ fontSize: "0.95em", fontWeight: "bold" }}
                >
                  {getFriendlyTagName(type)}
                </span>
              </span>
              <span class="tag-count">({tags.length})</span>
            </summary>
            <div class="tag-options">
              {tags.map((tag) => (
                <FilterTag
                  key={tag.slug}
                  tag={tag}
                  type="add"
                  href={getTagsHref(
                    tag,
                    "add",
                    currentSearchParams ?? new URLSearchParams(),
                    selectedTags,
                  )}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
