import { PiTag } from "@preact-icons/pi";
import { Tag as TagModel } from "../../data/models/tag.model.ts";

export function Tag({ tag }: { tag: TagModel }) {
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
