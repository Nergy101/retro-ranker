// deno-lint-ignore-file no-console
import { FreshContext } from "$fresh/server.ts";
import { TagModel } from "../../../data/models/tag.model.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

export const handler = {
  async GET(_: Request, ctx: FreshContext) {
    const deviceService = DeviceService.getInstance();

    const params = new URLSearchParams(ctx.url.search);
    const searchQuery = params.get("search");
    const category = params.get("category") as
      | "all"
      | "low"
      | "mid"
      | "high"
      | "all";
    const sortBy = params.get("sortBy") as
      | "all"
      | "highly-ranked"
      | "new-arrivals"
      | "all";
    const filter = params.get("filter") as
      | "all"
      | "upcoming"
      | "personal-picks"
      | "all";
    const pageNumber = Number.parseInt(params.get("pageNumber") || "1");
    const pageSize = Number.parseInt(params.get("pageSize") || "9");
    const tagsParam = params.get("tags")?.split(",") || [];

    const tags = tagsParam.map((tag) => {
      return deviceService.getTagBySlug(tag);
    }).filter((tag) => tag !== null) as TagModel[];

    if (searchQuery || category || sortBy || filter || pageNumber || pageSize) {
      const devices = deviceService.searchDevices(
        searchQuery || "",
        category,
        sortBy,
        filter,
        tags,
        pageNumber,
        pageSize,
      );
      console.info("API call success: devices/index ", {
        searchQuery,
        category,
        sortBy,
        filter,
        pageNumber,
        pageSize,
      });
      return Response.json(devices, { status: 200 });
    }

    // If no search query, return all devices
    console.info("API call success for all devices: devices/index ");
    return Response.json(deviceService.getAllDevices(), { status: 200 });
  },
};
