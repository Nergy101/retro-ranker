import { FreshContext } from "$fresh/server.ts";
import { createPocketBaseService } from "../services/pocketbase/pocketbase.service.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);

  const pbService = createPocketBaseService();
  const pb = pbService.getPocketBase();

  const jwt = req.headers.get("cookie")?.split("pb_auth=")[1]?.split(";")[0];

  if (jwt) {
    try {
      pb.authStore.save(jwt, null); // Store JWT in PocketBase instance
      const user = await pb.collection("users").authRefresh();
      ctx.state.user = user.record; // Attach user to context
    } catch (_) {
      ctx.state.user = null; // Token invalid or not logged in
    }
  }

  const response = await ctx.next();

  if (
    url.pathname.startsWith("/devices/") ||
    url.pathname.startsWith("/about") ||
    url.pathname.startsWith("/charts")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=86400",
    );
  }

  return response;
}
