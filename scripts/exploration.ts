import { Device } from "../data/device.model.ts";

const devices = JSON.parse(Deno.readTextFileSync("../data/source/results/handhelds.json")) as Device[];

const allDistinctTags = devices.flatMap((device) => device.tags).filter(
    (tag, index, self) =>
      index === self.findIndex((t) => t.slug === tag.slug),
  ).sort((a, b) => a.type.localeCompare(b.type));

for (const tag of allDistinctTags) {
    console.log(tag)
}