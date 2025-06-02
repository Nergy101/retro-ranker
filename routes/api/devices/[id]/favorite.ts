import { ProblemDetail } from "../../../../data/frontend/contracts/problem-detail.ts";
import {
  createLoggedInPocketBaseService,
  createSuperUserPocketBaseService,
} from "../../../../data/pocketbase/pocketbase.service.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async POST(ctx) {
    const req = ctx.req;
    const deviceId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return new Response(
        JSON.stringify(ProblemDetail.unauthorized("Not logged in")),
        { status: 401 },
      );
    }

    try {
      const pb = await createLoggedInPocketBaseService(cookie);
      const user = pb.getCurrentUser();

      const adminPb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Check if user already favorited this device
      const existingFavorite = await adminPb.getList(
        "device_favorites",
        1,
        1,
        {
          filter: `device="${deviceId}" && user="${user.id}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingFavorite.items.length > 0) {
        return new Response(
          JSON.stringify(ProblemDetail.badRequest("Already favorited")),
          { status: 400 },
        );
      }

      // Create new favorite
      await adminPb.create("device_favorites", {
        device: deviceId,
        user: user.id,
      });

      return new Response(null, { status: 201 });
    } catch {
      return new Response(
        JSON.stringify(
          ProblemDetail.internalServerError("Failed to favorite device"),
        ),
        { status: 500 },
      );
    }
  },

  async DELETE(ctx) {
    const req = ctx.req;
    const deviceId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return new Response(
        JSON.stringify(ProblemDetail.unauthorized("Not logged in")),
        { status: 401 },
      );
    }

    try {
      const pb = await createLoggedInPocketBaseService(cookie);
      const user = pb.getCurrentUser();

      // Find and delete the favorite
      const existingFavorite = await pb.getList(
        "device_favorites",
        1,
        1,
        {
          filter: `device="${deviceId}" && user="${user.id}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingFavorite.items.length === 0) {
        return new Response(
          JSON.stringify(ProblemDetail.notFound("Favorite not found")),
          { status: 404 },
        );
      }

      await pb.delete("device_favorites", existingFavorite.items[0].id);

      return new Response(null, { status: 204 });
    } catch {
      return new Response(
        JSON.stringify(
          ProblemDetail.internalServerError("Failed to unfavorite device"),
        ),
        { status: 500 },
      );
    }
  },
};
