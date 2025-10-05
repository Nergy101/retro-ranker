import { createSuperUserPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { AchievementService } from "../../../data/frontend/services/achievement.service.ts";
import { Context } from "fresh";
import { State } from "../../../utils.ts";

export const handler = {
  async POST(ctx: Context<State>) {
    const req = ctx.req;

    try {
      const body = await req.json();
      const { userId } = body;

      if (!userId) {
        return new Response("Missing userId", { status: 400 });
      }

      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      const achievementService = new AchievementService(pb);
      const unlockedAchievements = await achievementService
        .checkAndUnlockAchievements(userId);

      return new Response(
        JSON.stringify({
          success: true,
          unlockedAchievements,
          message: `Unlocked ${unlockedAchievements.length} achievements`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Failed to check achievements:", error);
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
