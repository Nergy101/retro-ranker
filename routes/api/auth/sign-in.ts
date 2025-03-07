import { Handlers } from "$fresh/server.ts";
import { setCookie } from "@std/http/cookie";
import { ProblemDetail } from "../../../data/contracts/problem-detail.ts";
import { createPocketBaseService } from "../../../services/pocketbase/pocketbase.service.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return new Response(
        JSON.stringify(
          ProblemDetail.badRequest("Missing email or password"),
        ),
        { status: 400 },
      );
    }

    const pbService = createPocketBaseService();
    const user = await pbService.authWithPassword(email, password);

    if (!user) {
      return new Response(
        JSON.stringify(
          ProblemDetail.forbidden("Invalid email or password"),
        ),
        { status: 403 },
      );
    }

    const headers = new Headers();
    headers.set("location", "/profile");

    setCookie(headers, {
      name: "pb_auth",
      value: user.token,
      maxAge: 3600,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    return new Response(null, { status: 303, headers });
  },
};
