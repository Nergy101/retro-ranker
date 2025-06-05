import { setCookie } from "@std/http/cookie";
import { ProblemDetail } from "../../../data/frontend/contracts/problem-detail.ts";
import { createPocketBaseService } from "../../../data/pocketbase/pocketbase.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async GET(_ctx: FreshContext) {
    // render the sign-in page
    return new Response(null, { status: 200 });
  },
  async POST(ctx: FreshContext) {
    const req = ctx.req;
    const headers = new Headers();

    const url = new URL(req.url);
    const form = await req.formData();
    const nickname = form.get("nickname")?.toString();
    const password = form.get("password")?.toString();

    if (!nickname || !password) {
      return new Response(
        JSON.stringify(
          ProblemDetail.badRequest("Missing nickname or password"),
        ),
        { status: 400 },
      );
    }

    const pbService = await createPocketBaseService();

    let user = null;
    try {
      user = await pbService.authWithPassword(nickname, password);
    } catch {
      // do nothing
    }

    if (!user) {
      headers.set("location", "/auth/sign-in?error=invalid-credentials");

      return new Response(
        JSON.stringify(
          ProblemDetail.forbidden("Invalid nickname or password"),
        ),
        { status: 303, headers },
      );
    }

    headers.set("location", "/profile");

    setCookie(headers, {
      name: "pb_auth",
      value: user.token,
      maxAge: 3600,
      sameSite: "Strict",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    return new Response(null, { status: 303, headers });
  },
};
