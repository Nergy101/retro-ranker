import { PiTag } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { FilterTag } from "../components/shared/FilterTag.tsx";
import {
  TAG_FRIENDLY_NAMES,
  TagModel,
} from "../data/frontend/models/tag.model.ts";

export default function TagTypeahead(
  { allTags, initialSelectedTags }: {
    allTags: TagModel[];
    initialSelectedTags: TagModel[];
  },
) {
  const selectedTags = useSignal<TagModel[]>(initialSelectedTags);
  const searchTerm = useSignal<string>("");

  const filteredTags = [
    ...new Set(
      allTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      ),
    ),
  ];

  const getFriendlyTagName = (type: string) => {
    return TAG_FRIENDLY_NAMES[type as keyof typeof TAG_FRIENDLY_NAMES] ?? type;
  };

  const getTagsHref = (
    tag: TagModel,
    type: "add" | "remove",
  ) => {
    // if a tag with the same type is present, filter it out and insert the new one
    let tagSlugs = "";
    let filteredTags = [];

    if (type === "add") {
      filteredTags = initialSelectedTags.filter((t) => t.type !== tag.type)
        .concat(tag)
        .filter((t) => t.slug !== "");
    } else {
      filteredTags = initialSelectedTags.filter((t) => t.type !== tag.type).filter((
        t,
      ) => t.slug !== "");
    }

    tagSlugs = filteredTags.map((t) => t.slug).join(",");

    if (tagSlugs != "") {
      return `/devices?tags=${tagSlugs}`;
    }

    return `/devices`;
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

      // Then sort the tags within each type alphabetically by name
      const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
      return [type, sortedTags];
    }),
  );

  return (
    <div>
      <div class="selected-tags-container">
        {selectedTags.value.length > 0
          ? (
            <>
              <h4 style={{ textAlign: "center" }}>
                Selected tags to filter on
              </h4>
              <div class="tags">
                {selectedTags.value.map((tag) => (
                  <FilterTag
                    key={tag.slug}
                    tag={tag}
                    type="remove"
                    href={getTagsHref(tag, "remove")}
                  />
                ))}
              </div>
            </>
          )
          : (
            <p class="empty-selection">
              No filters selected. Select tags below to filter devices.
            </p>
          )}
      </div>

      <div class="search-container">
        <input
          type="text"
          placeholder="Search for tags..."
          value={searchTerm}
          onInput={(e) => searchTerm.value = e.currentTarget.value}
          class="tag-search-input"
        />
      </div>

      <div class="filter-categories">
        {Object.entries(sortedGroupedTags).map(([type, tags]) => (
          <details
            key={type}
            class="filter-category"
            open={searchTerm.value.length > 0}
          >
            <summary class="category-header">
              <span class="category-icon" style={{ display: "inline-flex", alignItems: "space-between", gap: "0.4em" }}>
                <span style={{ fontSize: "20px", display: "flex", alignItems: "center" }}><PiTag /></span>
                <span class="category-label" style={{ fontSize: "0.95em", fontWeight: "bold" }}>{getFriendlyTagName(type)}</span>
              </span>
              <span class="tag-count">({tags.length})</span>
            </summary>
            <div class="tag-options">
              {tags.map((tag) => (
                <FilterTag
                  key={tag.slug}
                  tag={tag}
                  type="add"
                  href={getTagsHref(tag, "add")}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
