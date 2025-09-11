import { Head } from "fresh/runtime";
import { PiChartLine, PiInfo, PiQuestion } from "@preact-icons/pi";
import { tracer } from "../../data/tracing/tracer.ts";
import { State } from "../../utils.ts";
import { Context, page } from "fresh";

export const handler = {
  async GET(ctx: Context<State>) {
    ctx.state.seo = {
      title: "Retro Ranker - FAQ",
      description: "Frequently Asked Questions (FAQ)",
      keywords:
        "retro ranker faq, retro gaming questions, handheld comparison help, device catalog faq, emulation device questions",
    };

    ctx.state.data = {
      // No additional data needed for FAQ page
    };

    return await tracer.startActiveSpan("route:faq", async (span: any) => {
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

export default function FAQ(ctx: Context<State>) {
  const state = ctx.state;
  const translations = state.translations ?? {};

  return (
    <div class="faq-page">
      <Head>
        <title>Retro Ranker - FAQ</title>
        <meta name="description" content="Frequently Asked Questions (FAQ)" />
      </Head>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
        <hgroup style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--pico-muted-color)" }}>
            Everything you need to know about Retro Ranker
          </p>
        </hgroup>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              color: "var(--pico-primary)",
              marginBottom: "1rem",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiQuestion class="text-2xl" /> General
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiQuestion class="text-2xl" /> What is Retro Ranker?
              </summary>
              <p class="pl-8">
                Retro Ranker is a platform to compare, review, and discover
                retro gaming handhelds, helping you find the perfect device for
                your needs.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> Which brands are included?
              </summary>
              <p class="pl-8">
                We cover popular brands like Anbernic, Miyoo, Ayaneo, Powkiddy,
                and more in our device catalog.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> How often is the catalog updated?
              </summary>
              <p class="pl-8">
                The catalog is updated daily as new devices are released,
                reviewed, and added to the community datasheet. Check the
                release timeline for the latest additions.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> Can I submit my own review?
              </summary>
              <p class="pl-8">
                Yes! Log in or create an account, then visit any device page to
                submit your review and rating.
              </p>
            </details>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              color: "var(--pico-primary)",
              marginBottom: "1rem",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiInfo class="text-2xl" /> Devices & Catalog
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                How do I search for a specific device?
              </summary>
              <p class="pl-8">
                <ul>
                  <li>
                    <strong>Quick:</strong>{" "}
                    You can use the search bar in the top menu for a quick
                    search.
                  </li>
                  <li>
                    <strong>
                      <a href="/devices">Advanced</a>
                    </strong>: You can also use the filters and sorting options
                    to narrow down devices by price, release year, brand, and
                    more in the device catalog.
                  </li>
                </ul>
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                Can I filter devices by price or specs?
              </summary>
              <p class="pl-8">
                Yes, use the filters and sorting options to narrow down devices
                by price, release year, brand, and more in the device catalog.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> What are the most popular brands?
              </summary>
              <p class="pl-8">
                Popular brands include Anbernic, Miyoo, Ayaneo, Powkiddy, and
                others. Browse all brands in the catalog.
              </p>
            </details>
          </div>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              color: "var(--pico-primary)",
              marginBottom: "1rem",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <PiChartLine class="text-2xl" /> Device Comparison
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiChartLine class="text-2xl" /> How do I compare devices?
              </summary>
              <p class="pl-8">
                Use our comparison tool to select and compare technical specs,
                performance, and user reviews of different retro handhelds.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiChartLine class="text-2xl" /> How does the ranking work?
              </summary>
              <div class="pl-8">
                <p>
                  The ranking is based on all relevant properties of the
                  devices. Every property is given a score and placed into a
                  category. The categories are then weighted and summed up to
                  get the final results.
                  <br />
                  <strong>Category weights:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <ul>
                      <li>Performance (30%)</li>
                      <li>Monitor (10%)</li>
                      <li>Dimensions (10%)</li>
                    </ul>
                    <ul>
                      <li>Connectivity (20%)</li>
                      <li>Audio (10%)</li>
                      <li>Controls (10%)</li>
                    </ul>
                    <ul>
                      <li>Misc (10%)</li>
                    </ul>
                  </div>
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: "fit-content",
                      backgroundColor: "#3952A2",
                      color: "white",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                    }}
                  >
                    Blue means equal
                  </span>
                  <br />
                  <span
                    style={{
                      width: "fit-content",
                      backgroundColor: "#16833E",
                      color: "white",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                    }}
                  >
                    Green means better
                  </span>
                  <br />
                  <span
                    style={{
                      width: "fit-content",
                      backgroundColor: "#AB0D0D",
                      color: "white",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                    }}
                  >
                    Red means worse
                  </span>
                </div>
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
