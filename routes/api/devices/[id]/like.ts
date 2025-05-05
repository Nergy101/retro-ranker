import { Handlers } from "$fresh/server.ts";
import { ProblemDetail } from "../../../../data/frontend/contracts/problem-detail.ts";
import { createLoggedInPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
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

      // Check if user already liked this device
      const existingLike = await pb.getList(
        "device_likes",
        1,
        1,
        {
          filter: `deviceId="${deviceId}" && userId="${user.id}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingLike.items.length > 0) {
        return new Response(
          JSON.stringify(ProblemDetail.badRequest("Already liked")),
          { status: 400 },
        );
      }

      // Create new like
      await pb.create("device_likes", {
        deviceId,
        userId: user.id,
      });

      return new Response(null, { status: 201 });
    } catch {
      return new Response(
        JSON.stringify(
          ProblemDetail.internalServerError("Failed to like device"),
        ),
        { status: 500 },
      );
    }
  },

  async DELETE(req, ctx) {
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

      // Find and delete the like
      const existingLike = await pb.getList(
        "device_likes",
        1,
        1,
        {
          filter: `deviceId="${deviceId}" && userId="${user.id}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingLike.items.length === 0) {
        return new Response(
          JSON.stringify(ProblemDetail.notFound("Like not found")),
          { status: 404 },
        );
      }

      await pb.delete("device_likes", existingLike.items[0].id);

      return new Response(null, { status: 204 });
    } catch {
      return new Response(
        JSON.stringify(
          ProblemDetail.internalServerError("Failed to unlike device"),
        ),
        { status: 500 },
      );
    }
  },
};
