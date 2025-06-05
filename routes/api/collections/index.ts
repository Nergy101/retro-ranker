import { User } from "../../../data/frontend/contracts/user.contract.ts";
import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async POST(ctx: FreshContext) {
    const request = ctx.req;
    const pbService = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
    );

    const form = await request.formData();
    const name = form.get("name")?.toString();
    const description = form.get("description")?.toString();
    const type = form.get("type")?.toString();
    const orderRaw = form.get("order")?.toString();
    let order: Array<Record<string, number>> | undefined = undefined;
    if (orderRaw) {
      try {
        order = JSON.parse(orderRaw);
      } catch (_e) {
        return new Response("Invalid order format", { status: 400 });
      }
    }
    const deviceIds: string[] = form.get("deviceIds")?.toString().split(",") ??
      [];

    if (!name) {
      return new Response("Missing name", { status: 400 });
    }

    const user = ctx.state.user as User | null;
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const filter = deviceIds.map((id) => `nameSanitized="${id}"`).join("||");
    const devices = await pbService.getList("devices", 1, 100, {
      filter,
      sort: "",
      expand: "",
    });

    const collection = await pbService.create("device_collections", {
      name,
      description,
      owner: user.id,
      devices: devices.items.map((device) => device.id),
      type,
      order,
    });

    return new Response(JSON.stringify(collection), {
      status: 302,
      headers: {
        Location: `/profile`,
      },
    });
  },
};
