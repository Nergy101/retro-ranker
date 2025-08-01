// deno-lint-ignore-file no-console
import { FreshContext } from "fresh";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";

export const handler = {
  async GET(ctx: FreshContext) {
    const name = ctx.params.name;

    if (!name) {
      console.warn(
        "API call failed, name is required: devices/[name] ",
        ctx.params.name,
      );
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const deviceService = await DeviceService.getInstance();
    const device = await deviceService.getDeviceByName(name);

    if (!device) {
      console.warn(
        "API call failed, device not found: devices/[name] ",
        ctx.params.name,
      );
      return Response.json({ error: "Device not found" }, { status: 404 });
    }

    console.info("API call success: devices/[name] ", ctx.params.name);
    return Response.json(device, { status: 200 });
  },
};
