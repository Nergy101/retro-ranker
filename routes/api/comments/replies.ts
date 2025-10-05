import { createLoggedInPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { Context } from "fresh";
import { State } from "../../../utils.ts";

export const handler = {
  async POST(ctx: Context<State>) {
    const req = ctx.req;
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const pb = await createLoggedInPocketBaseService(cookie);
      const user = pb.getCurrentUser();

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }

      const body = await req.json();
      const { device_id, parent_comment_id, content } = body;

      console.log("Creating reply:", {
        device_id,
        parent_comment_id,
        content: content.substring(0, 50) + "...",
      });

      if (!device_id || !parent_comment_id || !content) {
        return new Response("Missing required fields", { status: 400 });
      }

      // Get the parent comment to determine thread_id and depth
      const parentComment = await pb.getOne(
        "device_comments",
        parent_comment_id,
        {
          expand: "",
        },
      );

      if (!parentComment) {
        return new Response("Parent comment not found", { status: 404 });
      }

      const threadId = parentComment.thread_id || parentComment.id;
      const depth = (parentComment.depth || 0) + 1;

      // Check depth limit (max 3 levels)
      if (depth > 3) {
        return new Response("Maximum reply depth reached", { status: 400 });
      }

      // Create the reply
      const reply = await pb.create("device_comments", {
        device: device_id,
        user: user.id,
        content,
        parent_comment: parent_comment_id,
        thread_id: threadId,
        depth,
      });

      console.log("Reply created successfully:", reply.id);

      // Get the referer URL from the request headers
      const referer = req.headers.get("referer") || "/";

      // Redirect back to the previous page
      return new Response(null, {
        status: 303,
        headers: {
          "Location": referer,
        },
      });
    } catch (error) {
      console.error("Failed to create reply:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
