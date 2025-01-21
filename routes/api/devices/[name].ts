import { FreshContext } from "$fresh/server.ts";
import { DeviceService } from "../../../services/devices/device.service.ts";

export const handler = {
  async GET(_: Request, ctx: FreshContext) {
    const name = ctx.params.name;

    if (!name) {
      console.warn(
        "API call failed, name is required: devices/[name] ",
        ctx.params.name,
      );
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const deviceService = DeviceService.getInstance();
    const device = deviceService.getDeviceByName(name);

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
