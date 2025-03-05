import { PiTag } from "@preact-icons/pi";
import { TAG_FRIENDLY_NAMES, TagModel } from "../../data/models/tag.model.ts";

export function TagComponent({ tag }: { tag: TagModel }) {
  const slug = tag.slug;

  const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

  return (
    <a href={`/devices?tags=${slug}`} class="tag-link" data-tooltip={friendlyName}>
      <span class="tag">
        <PiTag />
        {tag.name}
      </span>
    </a>
  );
}
