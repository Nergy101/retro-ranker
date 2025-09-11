import { Context } from "fresh";
import { deleteAuthCookie, State } from "../../../utils.ts";

export const handler = {
  GET(ctx: Context<State>) {
    const req = ctx.req;
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    deleteAuthCookie(headers, url.hostname);

    headers.set("location", "/");

    return new Response(null, { status: 302, headers });
  },
};
