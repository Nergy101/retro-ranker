import { createSuperUserPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";
import { AchievementService } from "../../../../data/frontend/services/achievement.service.ts";
import { Context } from "fresh";
import { State } from "../../../../utils.ts";

export const handler = {
  async POST(ctx: Context<State>) {
    const req = ctx.req;

    try {
      const form = await req.formData();

      const deviceId = form.get("device");
      const userId = form.get("user");
      const content = form.get("content");

      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Create the comment in PocketBase
      await pb.create("device_comments", {
        device: deviceId,
        user: userId,
        content,
      });

      // Check and unlock achievements using superuser service
      const superUserPb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );
      const achievementService = new AchievementService(superUserPb);
      await achievementService.checkAndUnlockAchievements(userId as string);

      // Get the referer URL from the request headers
      const referer = req.headers.get("referer") || "/";

      // Redirect back to the previous page
      return new Response(null, {
        status: 303,
        headers: {
          "Location": referer,
        },
      });
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
