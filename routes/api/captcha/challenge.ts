import cap from "../../../data/cap/cap.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async POST(_ctx: FreshContext) {
    const challenge = cap.createChallenge();

    return new Response(JSON.stringify(challenge), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
