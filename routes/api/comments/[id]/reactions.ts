import {
  createLoggedInPocketBaseService,
  createSuperUserPocketBaseService,
} from "../../../../data/pocketbase/pocketbase.service.ts";
import { Context } from "fresh";
import { State } from "../../../../utils.ts";

export const handler = {
  async GET(ctx: Context<State>) {
    const req = ctx.req;
    const commentId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    try {
      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      // Get all reactions for this comment
      const reactions = await pb.getList(
        "comment_reactions",
        1,
        100,
        {
          filter: `comment="${commentId}"`,
          sort: "-created",
          expand: "user",
        },
      );

      // Count reactions by type
      const counts: Record<string, number> = {};
      const userReactions: Record<string, boolean> = {};

      // Get current user from cookie if available
      let currentUserId: string | null = null;
      if (cookie) {
        try {
          const userPb = await createLoggedInPocketBaseService(cookie);
          const currentUser = userPb.getCurrentUser();
          currentUserId = currentUser?.id || null;
        } catch {
          // User not logged in or invalid cookie
        }
      }

      reactions.items.forEach((reaction) => {
        counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) +
          1;

        // Check if current user has this reaction
        if (currentUserId && reaction.expand?.user?.id === currentUserId) {
          userReactions[reaction.reaction_type] = true;
        }
      });

      return new Response(
        JSON.stringify({
          counts,
          userReactions,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Failed to get reactions:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  async POST(ctx: Context<State>) {
    const req = ctx.req;
    const commentId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // Get current user from cookie
      const userPb = await createLoggedInPocketBaseService(cookie);
      const user = userPb.getCurrentUser();

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }

      // Use superuser service for database operations
      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      const body = await req.json();
      const { reaction_type } = body;

      if (
        !reaction_type ||
        !["thumbs_up", "thumbs_down", "heart", "laugh"].includes(
          reaction_type,
        )
      ) {
        return new Response("Invalid reaction type", { status: 400 });
      }

      // Check if user already has a reaction of this type on this comment
      const existingReaction = await pb.getList(
        "comment_reactions",
        1,
        1,
        {
          filter:
            `comment="${commentId}" && user="${user.id}" && reaction_type="${reaction_type}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingReaction.items.length > 0) {
        return new Response("Reaction already exists", { status: 400 });
      }

      // Create the reaction
      await pb.create("comment_reactions", {
        comment: commentId,
        user: user.id,
        reaction_type,
      });

      return new Response(null, { status: 201 });
    } catch (error) {
      console.error("Failed to create reaction:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  async DELETE(ctx: Context<State>) {
    const req = ctx.req;
    const commentId = ctx.params.id;
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // Get current user from cookie
      const userPb = await createLoggedInPocketBaseService(cookie);
      const user = userPb.getCurrentUser();

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }

      // Use superuser service for database operations
      const pb = await createSuperUserPocketBaseService(
        Deno.env.get("POCKETBASE_SUPERUSER_EMAIL")!,
        Deno.env.get("POCKETBASE_SUPERUSER_PASSWORD")!,
        Deno.env.get("POCKETBASE_URL")!,
      );

      const body = await req.json();
      const { reaction_type } = body;

      if (!reaction_type) {
        return new Response("Reaction type required", { status: 400 });
      }

      // Find and delete the reaction
      const existingReaction = await pb.getList(
        "comment_reactions",
        1,
        1,
        {
          filter:
            `comment="${commentId}" && user="${user.id}" && reaction_type="${reaction_type}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingReaction.items.length === 0) {
        return new Response("Reaction not found", { status: 404 });
      }

      await pb.delete("comment_reactions", existingReaction.items[0].id);

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Failed to delete reaction:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
