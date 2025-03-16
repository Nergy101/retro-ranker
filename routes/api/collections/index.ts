import { Handlers } from "$fresh/server.ts";
import { load } from "$std/dotenv/mod.ts";
import { User } from "../../../data/frontend/contracts/user.contract.ts";
import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";

export const handler: Handlers = {
  async POST(request, ctx) {
    const env = await load({ envPath: ".env", allowEmptyValues: true });

    const pbService = await createSuperUserPocketBaseService(
      env.POCKETBASE_SUPERUSER_EMAIL,
      env.POCKETBASE_SUPERUSER_PASSWORD,
      env.POCKETBASE_URL,
    );

    const form = await request.formData();
    const name = form.get("name")?.toString();
    const description = form.get("description")?.toString();
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
    const devices = await pbService.getList("devices", 1, 100, filter);

    const collection = await pbService.create("device_collections", {
      name,
      description,
      owner: user.id,
      devices: devices.items.map((device) => device.id),
    });

    return new Response(JSON.stringify(collection), {
      status: 302,
      headers: {
        Location: `/profile`,
      },
    });
  },
};
