import { createSuperUserPocketBaseService } from "../../../../data/pocketbase/pocketbase.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async POST(ctx: FreshContext) {
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
