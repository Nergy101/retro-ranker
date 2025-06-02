import { User } from "../../../data/frontend/contracts/user.contract.ts";
import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async PUT(ctx) {
    const request = ctx.req;
    const pbService = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
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

  async DELETE(ctx) {
    const { id } = ctx.params;

    const pbService = await createSuperUserPocketBaseService(
      Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
      Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
      Deno.env.get("POCKETBASE_URL")!,
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
