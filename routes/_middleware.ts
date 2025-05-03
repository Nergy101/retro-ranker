import { FreshContext } from "$fresh/server.ts";
import { createPocketBaseService } from "../data/pocketbase/pocketbase.service.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);

  const pbService = await createPocketBaseService();
  const cookieHeader = req.headers.get("cookie");

  if (cookieHeader) {
    try {
      const user = await pbService.getUser(cookieHeader);
      ctx.state.user = user; // Attach user to context
    } catch (_) {
      ctx.state.user = null; // Token invalid or not logged in
    }
  }

  const response = await ctx.next();

  if (
    url.pathname.endsWith("/devices") ||
    url.pathname.startsWith("/about") ||
    url.pathname.startsWith("/charts")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=86400",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 86400 * 1000).toUTCString(), // tomorrow
    );
  }
  return response;
}
