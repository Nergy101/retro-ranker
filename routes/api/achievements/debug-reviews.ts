import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { Context } from "fresh";
import { State } from "../../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response("Missing userId parameter", { status: 400 });
    }

    try {
      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Get all reviews for this user
      const userReviews = await pb.getList(
        "device_reviews",
        1,
        10,
        {
          filter: `user = "${userId}"`,
          sort: "-created",
          expand: "user,device",
        },
      );

      // Get all reviews (to see the structure)
      const allReviews = await pb.getList(
        "device_reviews",
        1,
        5,
        {
          filter: "",
          sort: "-created",
          expand: "user,device",
        },
      );

      return new Response(
        JSON.stringify({
          success: true,
          userId,
          userReviews: {
            totalItems: userReviews.totalItems,
            items: userReviews.items.map((review) => ({
              id: review.id,
              user: review.user,
              device: review.device,
              content: review.content?.substring(0, 100) + "...",
              created: review.created,
              expand: review.expand,
            })),
          },
          sampleReviews: {
            totalItems: allReviews.totalItems,
            items: allReviews.items.map((review) => ({
              id: review.id,
              user: review.user,
              device: review.device,
              content: review.content?.substring(0, 100) + "...",
              created: review.created,
              expand: review.expand,
            })),
          },
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Failed to debug reviews:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
