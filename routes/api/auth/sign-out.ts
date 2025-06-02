import { deleteCookie } from "@std/http/cookie";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  GET(ctx) {
    const req = ctx.req;
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    deleteCookie(headers, "pb_auth", { path: "/", domain: url.hostname });

    headers.set("location", "/");

    return new Response(null, { status: 302, headers });
  },
};
