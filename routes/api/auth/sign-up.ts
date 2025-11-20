import { Context } from "fresh";
import { State } from "../../../utils.ts";

export const handler = {
  async POST(_ctx: Context<State>) {
    // Traditional signup is no longer supported - redirect to OAuth signup page
    const headers = new Headers();
    headers.set("location", "/auth/sign-up");

    return new Response(null, { status: 303, headers });
  },
};
