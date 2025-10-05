import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { AchievementService } from "../../../data/frontend/services/achievement.service.ts";
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

      const achievementService = new AchievementService(pb);

      // Get user metrics
      const metrics = await achievementService.getUserMetrics(userId);

      return new Response(
        JSON.stringify({
          success: true,
          userId,
          metrics,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Failed to get user metrics:", error);
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
