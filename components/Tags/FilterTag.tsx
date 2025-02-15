import { PiPlusBold, PiTag, PiXBold } from "@preact-icons/pi";
import { TagModel } from "../../data/models/tag.model.ts";

export function FilterTag(
  { tag, type, href }: {
    tag: TagModel;
    type: "add" | "remove";
    href: string;
  },
) {
  return (
    <a href={href} class="tag-link" data-tooltip={tag.type}>
      <span class="tag">
        <PiTag />
        {tag.name}
        {type === "remove" && <PiXBold />}
        {type === "add" && <PiPlusBold />}
      </span>
    </a>
  );
}
