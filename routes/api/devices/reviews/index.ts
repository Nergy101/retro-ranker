import { createSuperUserPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";

export const handler = {
  async POST(req: Request) {
    try {
      const form = await req.formData();

      const deviceId = form.get("device");
      const userId = form.get("user");
      const content = form.get("content");
      const performance_rating = form.get("performance_rating");
      const monitor_rating = form.get("monitor_rating");
      const audio_rating = form.get("audio_rating");
      const controls_rating = form.get("controls_rating");
      const misc_rating = form.get("misc_rating");
      const connectivity_rating = form.get("connectivity_rating");
      const overall_rating = form.get("overall_rating");

      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Create the review in PocketBase
      await pb.create("device_reviews", {
        device: deviceId,
        user: userId,
        content,
        performance_rating: Number(performance_rating),
        monitor_rating: Number(monitor_rating),
        audio_rating: Number(audio_rating),
        controls_rating: Number(controls_rating),
        misc_rating: Number(misc_rating),
        connectivity_rating: Number(connectivity_rating),
        overall_rating: Number(overall_rating),
      });

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
