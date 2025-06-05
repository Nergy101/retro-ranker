import { deleteCookie } from "@std/http/cookie";
import { FreshContext } from "fresh";

export const handler = {
  GET(ctx: FreshContext) {
    const req = ctx.req;
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    deleteCookie(headers, "pb_auth", { path: "/", domain: url.hostname });

    headers.set("location", "/");

    return new Response(null, { status: 302, headers });
  },
};
