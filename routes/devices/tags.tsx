import { PageProps } from "$fresh/server.ts";
import SEO from "../../components/SEO.tsx";
import { TagModel } from "../../data/frontend/models/tag.model.ts";
import TagTypeahead from "../../islands/tag-typeahead.tsx";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";

export default function DeviceTags(props: PageProps) {
  const deviceService = DeviceService.getInstance();

  const selectedTagNames = props.url?.searchParams.get("tags")?.split(",") ??
    [];
  const allTags = deviceService.getAllTags();

  const selectedTags = selectedTagNames.map((tag) =>
    allTags.find((t) => t.slug === tag) ?? null
  ).filter((tag) => tag !== null) as TagModel[];

  const devicesWithSelectedTags = deviceService.getDevicesWithTags(
    selectedTags.filter((tag) => tag !== null) as TagModel[],
  );

  const allAvailableTags = () => {
    const allTags = deviceService.getAllTags();
    const selectedTagSlugs = selectedTags.map((tag) => tag.slug);

    const availableTags = allTags.filter((tag) => {
      // Exclude already selected tags
      if (selectedTagSlugs.includes(tag.slug)) {
        return false;
      }

      // Check if the tag is available in the resulting devices
      const devicesWithTag = deviceService.getDevicesWithTags([
        ...selectedTags,
        tag,
      ]);
      return devicesWithTag.length > 0;
    });

    return availableTags;
  };

  return (
    <div class="devices-by-tags-page">
      <SEO
        title="Device Tags"
        description="Browse devices by tags on Retro Ranker."
        url={`https://retroranker.site${props.url.pathname}`}
      />
      <h1 style={{ textAlign: "center" }}>🚧 Devices by Tags 🚧</h1>
      <TagTypeahead
        allTags={allAvailableTags()}
        initialTags={selectedTags}
        devicesWithSelectedTags={devicesWithSelectedTags}
      />
    </div>
  );
}
