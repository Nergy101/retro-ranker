import { Handlers } from "$fresh/server.ts";

import cap from "../../../data/cap/cap.service.ts";

export const handler: Handlers = {
  async POST() {
    const challenge = cap.createChallenge();

    return new Response(JSON.stringify(challenge), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
