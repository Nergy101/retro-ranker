import { PiTag } from "@preact-icons/pi";
import { TagModel } from "../../data/models/tag.model.ts";

export function TagComponent({ tag }: { tag: TagModel }) {
  const slug = tag.slug;

  return (
    <a href={`/devices?tags=${slug}`} class="tag-link" data-tooltip={tag.type}>
      <span class="tag">
        <PiTag />
        {tag.name}
      </span>
    </a>
  );
}
