import { FreshContext } from "$fresh/server.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

export const handler = {
  async GET(_: Request, ctx: FreshContext) {
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
      | "highly-rated"
      | "new-arrivals"
      | "all";
    const filter = params.get("filter") as
      | "all"
      | "upcoming"
      | "personal-picks"
      | "all";
    const pageNumber = Number.parseInt(params.get("pageNumber") || "1");
    const pageSize = Number.parseInt(params.get("pageSize") || "9");

    if (searchQuery || category || sortBy || filter || pageNumber || pageSize) {
      const deviceService = DeviceService.getInstance();
      const devices = deviceService.searchDevices(
        searchQuery || "",
        category,
        sortBy,
        filter,
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
    const deviceService = DeviceService.getInstance();
    const devices = deviceService.getAllDevices();

    console.info("API call success for all devices: devices/index ");
    return Response.json(devices, { status: 200 });
  },
};
