import { PiPlusBold, PiTag, PiXBold } from "@preact-icons/pi";
import { TAG_FRIENDLY_NAMES, TagModel } from "../../data/models/tag.model.ts";

export function FilterTag(
  { tag, type, href }: {
    tag: TagModel;
    type: "add" | "remove";
    href: string;
  },
) {
  const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

  return (
    <a href={href} class="tag-link" data-tooltip={friendlyName}>
      <span class="tag">
        <PiTag />
        {tag.name}
        {type === "remove" && <PiXBold />}
        {type === "add" && <PiPlusBold />}
      </span>
    </a>
  );
}
