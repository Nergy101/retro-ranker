// deno-lint-ignore-file no-console
import { FreshContext } from "fresh";
import { ProblemDetail } from "@data/frontend/contracts/problem-detail.ts";
import { User } from "@data/frontend/contracts/user.contract.ts";
import {
  createLoggedInPocketBaseService,
} from "@data/pocketbase/pocketbase.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";

interface SuggestionPayload {
  user: string;
  suggestion: string;
}

// Maximum number of suggestions allowed per user
const MAX_SUGGESTIONS_PER_USER = 5;

export const handler = {
  async POST(ctx: FreshContext) {
    const req = ctx.req;

    try {
      const cookie = req.headers.get("cookie");

      if (!(ctx.state as CustomFreshState).user || !cookie) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const user = (ctx.state as CustomFreshState).user as User;
      const payload = await req.json() as SuggestionPayload;

      if (!payload.suggestion || payload.suggestion.trim() === "") {
        return new Response(
          JSON.stringify({ error: "Suggestion cannot be empty" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // In a real application, you would save this to a database
      // For now, we'll just log it
      console.log(`Suggestion from ${user.id}: ${payload.suggestion}`);

      // save in pocketbase
      const pb = await createLoggedInPocketBaseService(cookie);
      await pb.authRefresh();

      // Ensure user is authenticated before creating a record
      if (!pb.getAuthStore().isValid) {
        console.log("Unauthorized");
        return new Response(
          JSON.stringify(ProblemDetail.forbidden("Unauthorized")),
          { status: 401 },
        );
      }

      // Check if the user has already submitted the maximum number of suggestions
      const existingSuggestions = await pb.getList(
        "suggestions",
        1,
        MAX_SUGGESTIONS_PER_USER + 1, // Get one more than the limit to check if we're over
        {
          filter: `user="${user.id}"`,
          sort: "",
          expand: "",
        },
      );

      if (existingSuggestions.items.length >= MAX_SUGGESTIONS_PER_USER) {
        return new Response(
          JSON.stringify({
            error:
              `You have reached the limit of ${MAX_SUGGESTIONS_PER_USER} suggestions. Thank you for your contributions!`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      await pb.create("suggestions", {
        user: user.id,
        suggestion: payload.suggestion,
      });

      // Return success response
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing suggestion:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process suggestion" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
