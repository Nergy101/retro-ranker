import cap from "../../../data/cap/cap.service.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async POST(ctx) {
    const req = ctx.req;

    try {
      const { token } = await req.json();

      if (!token) {
        return new Response(
          JSON.stringify({ success: false, error: "Token is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const isValid = await cap.validateToken(token, { keepToken: true });

      return new Response(JSON.stringify({ valid: isValid }), {
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
