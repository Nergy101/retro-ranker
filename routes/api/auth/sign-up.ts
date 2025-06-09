import { createPocketBaseService } from "@data/pocketbase/pocketbase.service.ts";
import { ProblemDetail } from "@data/frontend/contracts/problem-detail.ts";

import cap from "@data/cap/cap.service.ts";
import { FreshContext } from "fresh";

export const handler = {
  async POST(ctx: FreshContext) {
    const req = ctx.req;
    const form = await req.formData();
    const nickname = form.get("nickname")?.toString();
    const password = form.get("password")?.toString();
    const confirmPassword = form.get("confirmPassword")?.toString();
    const capToken = form.get("capToken")?.toString();

    // Basic validation
    if (!nickname || !password || !confirmPassword || !capToken) {
      return new Response(
        JSON.stringify(
          ProblemDetail.badRequest("Missing required fields"),
        ),
        {
          status: 400,
          headers: {
            "Content-Type": "application/problem+json",
          },
        },
      );
    }

    const capResponse = await cap.validateToken(capToken);

    if (!capResponse.success) {
      return new Response(
        JSON.stringify(ProblemDetail.badRequest("Invalid CAPTCHA token")),
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify(
          ProblemDetail.badRequest("Passwords do not match"),
        ),
        { status: 400 },
      );
    }

    const pbService = await createPocketBaseService();
    const existingUser = await pbService.getList(
      "users",
      1,
      1,
      {
        filter: `nickname="${nickname}"`,
        sort: "",
        expand: "",
      },
    );

    if (existingUser.items.length > 0) {
      return new Response(
        JSON.stringify(
          ProblemDetail.badRequest("Email already registered"),
        ),
        { status: 400 },
      );
    }
    await pbService.createUser(
      nickname,
      password,
      confirmPassword,
    );

    const headers = new Headers();
    headers.set("location", "/auth/sign-in");

    return new Response(null, { status: 303, headers });
  },
};
