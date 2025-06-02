import cap from "../../../data/cap/cap.service.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async POST(ctx) {
    const req = ctx.req;

    try {
      const { token, solutions } = await req.json();

      if (!token || !solutions) {
        return new Response(JSON.stringify({ success: false }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await cap.redeemChallenge({ token, solutions });

      if (!result.success) {
        return new Response(JSON.stringify(result), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
