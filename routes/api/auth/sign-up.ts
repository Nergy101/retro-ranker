import { Handlers } from "$fresh/server.ts";
import { createPocketBaseService } from "../../../services/pocketbase/pocketbase.service.ts";
import { ProblemDetail } from "../../../data/contracts/problem-detail.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const nickname = form.get("nickname")?.toString();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    const confirmPassword = form.get("confirmPassword")?.toString();

    // Basic validation
    if (!nickname || !email || !password || !confirmPassword) {
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
      `email="${email}"`,
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
      email,
      password,
      confirmPassword,
    );

    const headers = new Headers();
    headers.set("location", "/auth/sign-in");

    return new Response(null, { status: 303, headers });
  },
};
