import { ProblemDetail } from "@data/frontend/contracts/problem-detail.ts";
import { createSuperUserPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async GET(ctx: FreshContext) {
    const req = ctx.req;
    const deviceId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    try {
      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Get total like count
      const likes = await pb.getAll(
        "device_likes",
        {
          filter: `device="${deviceId}"`,
          expand: "",
          sort: "",
        },
      );

      let isLiked = false;
      if (cookie) {
        const user = pb.getCurrentUser();
        if (user) {
          // Check if current user has liked this device
          const userLike = await pb.getAll(
            "device_likes",
            {
              filter: `device="${deviceId}" && user="${user.id}"`,
              sort: "",
              expand: "",
            },
          );
          isLiked = userLike.length > 0;
        }
      }

      return new Response(
        JSON.stringify({
          count: likes.length,
          isLiked,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch {
      return new Response(
        JSON.stringify(
          ProblemDetail.internalServerError("Failed to get likes"),
        ),
        { status: 500 },
      );
    }
  },
};
