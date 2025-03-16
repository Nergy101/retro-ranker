import { Handlers } from "$fresh/server.ts";
import { load } from "$std/dotenv/mod.ts";
import { User } from "../../../data/frontend/contracts/user.contract.ts";
import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";

export const handler: Handlers = {
  async PUT(request, ctx) {
    const env = await load({ envPath: ".env", allowEmptyValues: true });

    const pbService = await createSuperUserPocketBaseService(
      env.POCKETBASE_SUPERUSER_EMAIL,
      env.POCKETBASE_SUPERUSER_PASSWORD,
      env.POCKETBASE_URL,
    );

    const form = await request.formData();
    const name = form.get("name")?.toString();
    const description = form.get("description")?.toString();
    const deviceIds: string[] = form.get("devices")?.toString().split(",") ??
      [];

    if (!name || !description) {
      return new Response("Missing name or description", { status: 400 });
    }

    const { id } = ctx.params;
    const collection = await pbService.getOne("device_collections", id);

    if (!collection) {
      return new Response("Collection not found", { status: 404 });
    }

    const user = ctx.state.user as User | null;
    if (collection.owner !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updatedCollection = await pbService.update("device_collections", id, {
      name,
      description,
      devices: deviceIds,
    });

    return new Response(JSON.stringify(updatedCollection), { status: 200 });
  },

  async DELETE(_, ctx) {
    const { id } = ctx.params;
    const env = await load({ envPath: ".env", allowEmptyValues: true });

    const pbService = await createSuperUserPocketBaseService(
      env.POCKETBASE_SUPERUSER_EMAIL,
      env.POCKETBASE_SUPERUSER_PASSWORD,
      env.POCKETBASE_URL,
    );

    const collection = await pbService.getOne("device_collections", id);

    if (!collection) {
      return new Response("Collection not found", { status: 404 });
    }

    const user = ctx.state.user as User | null;
    if (collection.owner !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await pbService.delete("device_collections", id);

    return new Response(null, { status: 204 });
  },
};
