import { useSignal } from "@preact/signals";
import { DeviceCardMedium } from "../components/cards/DeviceCardMedium.tsx";
import { FilterTag } from "../components/shared/FilterTag.tsx";
import { Device } from "../data/device.model.ts";
import { TagModel } from "../data/models/tag.model.ts";

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
      return `/devices-catalog/tags?tags=${tagSlugs}`;
    }

    return `/devices-catalog/tags`;
  };

  const groupedTags = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, TagModel[]>);

  return (
    <div>
      <div class="tags">
        {selectedTags.value.map((tag) => (
          <FilterTag
            key={tag.slug}
            tag={tag}
            type="remove"
            href={getTagsHref(
              tag,
              "remove",
            )}
          />
        ))}
      </div>

      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onInput={(e) => searchTerm.value = e.currentTarget.value}
      />

      {Object.entries(groupedTags).map(([type, tags]) => (
        <div key={type} class="tags-group">
          <h3 style={{ textAlign: "center" }}>{type} ({tags.length})</h3>
          <div class="tags">
            {tags.map((tag) => (
              <FilterTag
                key={tag.slug}
                tag={tag}
                type="add"
                href={getTagsHref(
                  tag,
                  "add",
                )}
              />
            ))}
          </div>
        </div>
      ))}

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
