import { PiPlusBold, PiTag, PiXBold } from "@preact-icons/pi";
import { useEffect, useState } from "preact/hooks";
import {
  TAG_FRIENDLY_NAMES,
  TagModel,
} from "../../data/frontend/models/tag.model.ts";

interface CollapsibleTagListProps {
  allTags: TagModel[];
  selectedTags: TagModel[];
  baseUrl: string;
  translations?: Record<string, string>;
}

export function CollapsibleTagList(
  { allTags, selectedTags, baseUrl, translations = {} }:
    CollapsibleTagListProps,
) {
  const getTranslation = (key: string, fallback: string) => {
    return translations[key] || fallback;
  };

  const getFriendlyTagName = (type: string) => {
    return TAG_FRIENDLY_NAMES[type as keyof typeof TAG_FRIENDLY_NAMES] ?? type;
  };

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

  // Group tags by type
  const groupedTags = allTags.reduce((acc, tag) => {
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

  const isTagSelected = (tag: TagModel) => {
    return selectedTags.some((selected) => selected.slug === tag.slug);
  };

  return (
    <div class="filter-categories">
      {Object.entries(sortedGroupedTags).map(([type, tags]) => (
        <details
          key={type}
          class="filter-category"
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
            {tags.map((tag) => {
              const selected = isTagSelected(tag);
              const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

              return (
                <a
                  key={tag.slug}
                  href={getTagsHref(
                    tag,
                    selected ? "remove" : "add",
                    currentSearchParams ?? new URLSearchParams(),
                    selectedTags,
                  ).toString()}
                  class="tag-link"
                  data-tooltip={friendlyName}
                >
                  <span class="tag">
                    <PiTag />
                    {tag.name}
                    {selected && <PiXBold />}
                    {!selected && <PiPlusBold />}
                  </span>
                </a>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}
