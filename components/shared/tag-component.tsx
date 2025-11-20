import { PiTag, PiX } from "@preact-icons/pi";
import {
  TAG_FRIENDLY_NAMES,
  TagModel,
} from "../../data/frontend/models/tag.model.ts";

export function TagComponent(
  { tag, tagType = "goTo", selectedTags = [], setSelectedTags = () => {} }: {
    tag: TagModel;
    tagType?: "add" | "remove" | "goTo";
    selectedTags?: TagModel[];
    setSelectedTags?: (tags: TagModel[]) => void;
  },
) {
  const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

  const addTag = (tag: TagModel) => {
    const newSelectedTags = [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    updateUrl(newSelectedTags);
  };

  const removeTag = (tagToRemove: TagModel) => {
    const newSelectedTags = selectedTags.filter(
      (tag) => tag.slug !== tagToRemove.slug,
    );
    setSelectedTags(newSelectedTags);
    updateUrl(newSelectedTags);
  };

  const updateUrl = (tags: TagModel[]) => {
    const url = new URL(globalThis.location.href);
    if (tags.length > 0) {
      url.searchParams.set("tags", tags.map((tag) => tag.slug).join(","));
    } else {
      url.searchParams.delete("tags");
    }
    url.searchParams.set("page", "1");
    globalThis.location.href = url.toString();
  };

  return (
    tagType == "goTo"
      ? (
        <a
          href={`/devices?tags=${tag.slug}`}
          class="tag-link"
          data-tooltip={friendlyName}
        >
          <span class="tag">
            <PiTag />
            {tag.name}
          </span>
        </a>
      )
      : (
        tagType === "add"
          ? (
            <a
              onClick={() => addTag(tag)}
              class="tag-link"
              data-tooltip={friendlyName}
            >
              <span class="tag">
                <PiTag />
                {tag.name}
              </span>
            </a>
          )
          : (
            <a
              onClick={() => removeTag(tag)}
              class="tag-link"
              data-tooltip={friendlyName}
            >
              <span class="tag">
                <PiX />
                {tag.name}
              </span>
            </a>
          )
      )
  );
}
