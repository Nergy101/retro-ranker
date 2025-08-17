// deno-lint-ignore-file no-console
import { FreshContext } from "fresh";
import { TagModel } from "@data/frontend/models/tag.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";

export const handler = {
  async GET(ctx: FreshContext) {
    const deviceService = await DeviceService.getInstance();

    const params = new URLSearchParams(ctx.url.search);
    const searchQuery = params.get("search");
    const category = params.get("category") as
      | "all"
      | "low"
      | "mid"
      | "high";
    const sortBy = params.get("sort") as
      | "all"
      | "highly-ranked"
      | "new-arrivals";
    const filter = params.get("filter") as
      | "all"
      | "upcoming"
      | "personal-picks";
    const pageNumber = Number.parseInt(params.get("pageNumber") || "1");
    const pageSize = Number.parseInt(params.get("pageSize") || "9");
    const tagsParam = params.get("tags")?.split(",") || [];

    const tags = (await Promise.all(
      tagsParam.map((tag) => deviceService.getTagBySlug(tag)),
    )).filter((tag) => tag !== null) as TagModel[];

    if (searchQuery || category || sortBy || filter || pageNumber || pageSize) {
      const devices = await deviceService.searchDevices(
        searchQuery || "",
        category,
        sortBy,
        filter,
        tags,
        pageNumber,
        pageSize,
      );
      console.log(devices);
      console.info("API call success: devices/index ", {
        searchQuery,
        category,
        sortBy,
        filter,
        pageNumber,
        pageSize,
        deviceCount: devices.page.length,
      });
      return Response.json(devices, { status: 200 });
    }

    // If no search query, return all devices
    console.info("API call success for all devices: devices/index ");
    return Response.json(await deviceService.getAllDevices(), { status: 200 });
  },
};
