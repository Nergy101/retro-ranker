import { Handlers } from "$fresh/server.ts";
import cap from "../../../data/cap/cap.service.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      console.log("Redeeming challenge");
      const { token, solutions } = await req.json();
      console.log("Token:", token);
      console.log("Solutions:", solutions);
      
      if (!token || !solutions) {
        return new Response(JSON.stringify({ success: false }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await cap.redeemChallenge({ token, solutions });
      console.log("Result:", result);

      console.log("This expires at:", new Date(result.expires ?? 0 * 1000));

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
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ success: false, error: errorMessage }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
