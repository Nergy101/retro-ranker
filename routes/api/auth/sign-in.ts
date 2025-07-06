import { ProblemDetail } from "@data/frontend/contracts/problem-detail.ts";
import { createPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { FreshContext } from "fresh";
import { setAuthCookie } from "../../../utils.ts";
import { validateCsrfToken } from "../../../utils.ts";

export const handler = {
  async GET(_ctx: FreshContext) {
    // render the sign-in page
    return new Response(null, { status: 200 });
  },
  async POST(ctx: FreshContext) {
    const req = ctx.req;
    const responseHeaders = new Headers();

    const url = new URL(req.url);
    const form = await req.formData();
    const nickname = form.get("nickname")?.toString();
    const password = form.get("password")?.toString();
    const csrf = form.get("csrf_token")?.toString();

    if (!validateCsrfToken(req.headers, csrf)) {
      return new Response(
        JSON.stringify(
          ProblemDetail.forbidden("Invalid CSRF token", {
            given: csrf,
          }),
        ),
        { status: 403 },
      );
    }

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
      responseHeaders.set(
        "location",
        "/auth/sign-in?error=invalid-credentials",
      );

      return new Response(
        JSON.stringify(
          ProblemDetail.forbidden("Invalid nickname or password"),
        ),
        { status: 303, headers: responseHeaders },
      );
    }

    responseHeaders.set("location", "/profile");

    setAuthCookie(responseHeaders, user.token, url.hostname);

    return new Response(null, { status: 303, headers: responseHeaders });
  },
};
