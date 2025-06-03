import cap from "../../../data/cap/cap.service.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async POST() {
    const challenge = cap.createChallenge();

    return new Response(JSON.stringify(challenge), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
