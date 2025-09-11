import cap from "../../../data/cap/cap.service.ts";
import { Context } from "fresh";
import { State } from "../../../utils.ts";

export const handler = {
  async POST(_ctx: Context<State>) {
    const challenge = cap.createChallenge();

    return new Response(JSON.stringify(challenge), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
