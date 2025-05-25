import { PageProps } from "$fresh/server.ts";
import SEO from "../../components/SEO.tsx";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import TagTypeahead from "../../islands/tag-typeahead.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";

export default async function DeviceTags(props: PageProps) {
  const deviceService = await DeviceService.getInstance();

  const selectedTagNames =
    new URL(props.url).searchParams.get("tags")?.split(",") ??
      [];
  const allTags = await deviceService.getAllTags();

  const selectedTags = selectedTagNames.map((tag) =>
    allTags.find((t) => t.slug === tag) ?? null
  ).filter((tag) => tag !== null) as TagModel[];

  const devicesWithSelectedTags = (await deviceService.getDevicesWithTags(
    selectedTags.filter((tag) => tag !== null) as TagModel[],
  )).sort((a, b) => {
    if (a.released?.mentionedDate && b.released?.mentionedDate) {
      return new Date(b.released?.mentionedDate).getTime() -
        new Date(a.released?.mentionedDate).getTime();
    }
    return 0;
  });

  const getAvailableTags = async () => {
    const allTags = await deviceService.getAllTags();
    const selectedTagSlugs = selectedTags.map((tag) => tag.slug);

    const availableTags = allTags.filter(async (tag) => {
      // Exclude already selected tags
      if (selectedTagSlugs.includes(tag.slug)) {
        return false;
      }

      // Check if the tag is available in the resulting devices
      const devicesWithTag = await deviceService.getDevicesWithTags([
        ...selectedTags,
        tag,
      ]);
      return devicesWithTag.length > 0;
    });

    return availableTags;
  };

  const allAvailableTags = await getAvailableTags();

  return (
    <div class="devices-by-tags-page">
      <SEO
        title="Device Tags"
        description="Browse devices by tags on Retro Ranker."
        url={`https://retroranker.site${props.url.pathname}`}
      />
      <h1 style={{ textAlign: "center" }}>🚧 Devices by Tags 🚧</h1>
      <TagTypeahead
        allTags={allAvailableTags}
        initialTags={selectedTags}
        devicesWithSelectedTags={devicesWithSelectedTags}
      />
    </div>
  );
}
