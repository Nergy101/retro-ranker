import { PiTag } from "@preact-icons/pi";
import { useSignal } from "@preact/signals";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { FilterTag } from "../components/shared/FilterTag.tsx";
import { Device } from "../data/device.model.ts";
import { TAG_FRIENDLY_NAMES, TagModel } from "../data/models/tag.model.ts";

export default function TagTypeahead(
  { allTags, initialTags, devicesWithSelectedTags }: {
    allTags: TagModel[];
    initialTags: TagModel[];
    devicesWithSelectedTags: Device[];
  },
) {
  const selectedTags = useSignal<TagModel[]>(initialTags);
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
      filteredTags = initialTags.filter((t) => t.type !== tag.type)
        .concat(tag)
        .filter((t) => t.slug !== "");
    } else {
      filteredTags = initialTags.filter((t) => t.type !== tag.type).filter((
        t,
      ) => t.slug !== "");
    }

    tagSlugs = filteredTags.map((t) => t.slug).join(",");

    if (tagSlugs != "") {
      return `/devices/tags?tags=${tagSlugs}`;
    }

    return `/devices/tags`;
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
          >
            <summary class="category-header">
              <span class="category-icon">
                <PiTag /> {getFriendlyTagName(type)}
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

      <h2 style={{ textAlign: "center" }}>
        Devices with selected tags: {devicesWithSelectedTags.length}
      </h2>
      <div class="device-search-grid-9">
        {devicesWithSelectedTags.map((device) => (
          <a
            href={`/devices/${device.name.sanitized}`}
            style={{
              textDecoration: "none",
              width: "100%",
            }}
          >
            <DeviceCardMedium device={device} isActive={false} />
          </a>
        ))}
      </div>
    </div>
  );
}
