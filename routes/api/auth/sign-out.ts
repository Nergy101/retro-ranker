import { FreshContext } from "fresh";
import { deleteAuthCookie } from "../../../utils.ts";

export const handler = {
  GET(ctx: FreshContext) {
    const req = ctx.req;
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    // Determine if we're in development or production
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isProduction = url.hostname === "retroranker.site";
    
    deleteAuthCookie(headers, url.hostname);

    headers.set("location", "/");

    return new Response(null, { status: 302, headers });
  },
};
