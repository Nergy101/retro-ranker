import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);

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
