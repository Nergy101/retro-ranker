import { PiPlusBold, PiTag, PiXBold } from "@preact-icons/pi";
import { useState } from "preact/hooks";
import { TAG_FRIENDLY_NAMES, TagModel } from "@/models/mod.ts";

export function FilterTag(
  { tag, type, href }: {
    tag: TagModel;
    type: "add" | "remove";
    href: URL;
  },
) {
  const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

  const [ariaBusy, setAriaBusy] = useState(false);

  return (
    <a href={href.toString()} class="tag-link" data-tooltip={friendlyName}>
      <span
        class="tag"
        onClick={() => {
          setAriaBusy(true);
        }}
        aria-busy={ariaBusy}
      >
        <PiTag />
        {tag.name}
        {type === "remove" && <PiXBold />}
        {type === "add" && <PiPlusBold />}
      </span>
    </a>
  );
}
