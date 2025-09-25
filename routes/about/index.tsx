import { tracer } from "../../data/tracing/tracer.ts";
import { State } from "../../utils.ts";
import { Context, page } from "fresh";

export const handler = {
  async GET(ctx: Context<State>) {
    ctx.state.seo = {
      title:
        "About Retro Ranker | Comprehensive Retro Gaming Handheld Platform",
      description:
        "Learn about Retro Ranker's mission to help retro gaming enthusiasts find their perfect handheld device. Discover our comprehensive database, comparison tools, and community-driven approach to portable gaming.",
      keywords:
        "about retro ranker, retro gaming platform, handheld comparison tool, retro gaming community, portable gaming database, emulation device reviews, retro gaming resources, handheld gaming guide",
      url: `https://retroranker.site${ctx.url.pathname}`,
    };

    ctx.state.data = {
      // No additional data needed for about page
    };

    return await tracer.startActiveSpan("route:about", async (span: any) => {
      try {
        const user = ctx.state?.user;
        span.setAttribute("user.authenticated", !!user);
        if (user && "email" in user) {
          span.setAttribute("user.email", user.email);
        }

        const result = page(ctx);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    });
  },
};

export default function About(ctx: Context<State>) {
  const state = ctx.state;
  const _translations = state.translations ?? {};

  return (
    <div class="about-page">
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        <hgroup style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            About Retro Ranker
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--pico-muted-color)" }}>
            Your comprehensive guide to retro gaming handhelds
          </p>
        </hgroup>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Our Mission
          </h2>
          <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
            Retro Ranker is dedicated to helping retro gaming enthusiasts make
            informed decisions when choosing their next handheld gaming device.
            We believe that everyone deserves access to comprehensive, unbiased
            information about the latest retro gaming handhelds.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            Our platform combines detailed specifications, performance metrics,
            and community insights to create the most comprehensive database of
            retro gaming handhelds available.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            What We Do
          </h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                background: "var(--pico-background-color)",
                borderRadius: "0.5rem",
                border: "1px solid var(--pico-muted-border-color)",
              }}
            >
              <h3
                style={{ margin: "0 0 0.5rem 0", color: "var(--pico-primary)" }}
              >
                📊 Comprehensive Comparisons
              </h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Side-by-side comparisons of devices across multiple categories
                including performance, build quality, value for money, and user
                satisfaction.
              </p>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "var(--pico-background-color)",
                borderRadius: "0.5rem",
                border: "1px solid var(--pico-muted-border-color)",
              }}
            >
              <h3
                style={{ margin: "0 0 0.5rem 0", color: "var(--pico-primary)" }}
              >
                🔍 Detailed Specifications
              </h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Complete technical specifications, pricing information, and
                release dates for hundreds of retro gaming handhelds.
              </p>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "var(--pico-background-color)",
                borderRadius: "0.5rem",
                border: "1px solid var(--pico-muted-border-color)",
              }}
            >
              <h3
                style={{ margin: "0 0 0.5rem 0", color: "var(--pico-primary)" }}
              >
                ⭐ Community-Driven Rankings
              </h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Rankings based on real user experiences, reviews, and
                performance data to help you find the perfect device for your
                needs.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--pico-primary)", marginBottom: "1rem" }}>
            Like what we do?
          </h2>
          <ul style={{ lineHeight: "1.6" }}>
            <li>
              <a href="https://ko-fi.com/nergy">
                <strong>Consider a donation at Ko-Fi</strong>
              </a>
            </li>
            <li>
              <strong>
                <a href="https://discord.gg/V6qwXmtCqa">Join the Discord</a>
              </strong>
            </li>
            <li>
              <strong>Community:</strong>{" "}
              We value input from the (retro) gaming community and incorporate
              user feedback. You can join the discord above, leave a comment on
              the Ko-Fi page, or log-in and leave feedback from your profile
              page.
            </li>
          </ul>
        </section>

        <section
          style={{ textAlign: "center", padding: "2rem 0", marginTop: "2rem" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Get Started</h2>
          <p
            style={{ marginBottom: "1.5rem", color: "var(--pico-muted-color)" }}
          >
            Ready to find your perfect retro gaming handheld?
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="/devices" class="button">
              📱 Browse Devices
            </a>
            <a href="/compare" class="button outline">
              ⚖️ Compare Devices
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
