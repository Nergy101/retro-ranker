import { User } from "../../../data/frontend/contracts/user.contract.ts";
import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { Context } from "fresh";
import { CustomFreshState } from "../../../interfaces/state.ts";
import { State } from "../../../utils.ts";

export const handler = {
  async PUT(ctx: Context<State>) {
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
    const type = form.get("type")?.toString();
    const orderRaw = form.get("order")?.toString();
    let order: Array<Record<string, number>> | undefined = undefined;
    if (orderRaw) {
      try {
        const parsed = JSON.parse(orderRaw);
        if (Array.isArray(parsed)) {
          order = parsed as Array<Record<string, number>>;
        }
      } catch {
        // ignore invalid order payload
      }
    }

    if (!name || !description) {
      return new Response("Missing name or description", { status: 400 });
    }

    const { id } = ctx.params;
    const collection = await pbService.getOne("device_collections", id);

    if (!collection) {
      return new Response("Collection not found", { status: 404 });
    }

    const user = (ctx.state as CustomFreshState).user as User | null;
    if (collection.owner !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload: Record<string, unknown> = {
      name,
      description,
      devices: deviceIds,
    };
    if (type) payload.type = type;
    if (order) payload.order = order;

    const updatedCollection = await pbService.update(
      "device_collections",
      id,
      payload,
    );

    return new Response(JSON.stringify(updatedCollection), { status: 200 });
  },

  async DELETE(ctx: Context<any>) {
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

    const user = (ctx.state as CustomFreshState).user as User | null;
    if (collection.owner !== user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await pbService.delete("device_collections", id);

    return new Response(null, { status: 204 });
  },
};
