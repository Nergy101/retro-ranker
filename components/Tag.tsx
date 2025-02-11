import { PiTag } from "@preact-icons/pi";
import { Tag as TagModel } from "../data/models/tag.model.ts";

export function Tag({ tag }: { tag: TagModel }) {
  const slug = tag.slug;

  return (
    <a href={`/devices?tag=${slug}`} class="tag-link">
      <span class="tag">
        <PiTag />
        {tag.name}
      </span>
    </a>
  );
}
