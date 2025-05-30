import { PiPlusBold, PiTag, PiXBold } from "@preact-icons/pi";
import {
  TAG_FRIENDLY_NAMES,
  TagModel,
} from "../../data/frontend/models/tag.model.ts";
import { useSignal } from "@preact/signals";

export function FilterTag(
  { tag, type, href }: {
    tag: TagModel;
    type: "add" | "remove";
    href: URL;
  },
) {
  const friendlyName = TAG_FRIENDLY_NAMES[tag.type];

  const ariaBusy = useSignal(false);

  return (
    <a href={href.toString()} class="tag-link" data-tooltip={friendlyName}>
      <span
        class="tag"
        onClick={() => {
          ariaBusy.value = true;
        }}
        aria-busy={ariaBusy.value}
      >
        <PiTag />
        {tag.name}
        {type === "remove" && <PiXBold />}
        {type === "add" && <PiPlusBold />}
      </span>
    </a>
  );
}
