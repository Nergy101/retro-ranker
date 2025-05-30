import SEO from "../components/SEO.tsx";
import { PiChartLine, PiInfo, PiQuestion } from "@preact-icons/pi";
import { PageProps } from "$fresh/server.ts";

export default function FAQ({ url }: PageProps) {
  return (
    <div
      class="faq about"
      style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}
    >
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about Retro Ranker, device comparisons, reviews, and more."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro ranker faq, retro gaming questions, handheld comparison help, device catalog faq, emulation device questions"
      />
      <h1 class="text-3xl font-bold mb-6" style={{ textAlign: "center" }}>
        Frequently Asked Questions
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <section>
          <h2
            class="text-xl font-semibold mb-3"
            style={{
              color: "var(--pico-primary)",
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
                Retro Ranker is a platform to{" "}
                <a href="/compare">compare</a>, review, and discover{" "}
                <a href="/devices">retro gaming handhelds</a>, helping you find
                the perfect device for your needs.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> Which brands are included?
              </summary>
              <p class="pl-8">
                We cover popular brands like{" "}
                <a href="/devices?tags=anbernic">Anbernic</a>,{" "}
                <a href="/devices?tags=miyoo-bittboy">Miyoo</a>,{" "}
                <a href="/devices?tags=ayaneo">Ayaneo</a>,{" "}
                <a href="/devices?tags=powkiddy">Powkiddy</a>, and more in our
                {" "}
                <a href="/devices">device catalog</a>.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> How often is the catalog updated?
              </summary>
              <p class="pl-8">
                The catalog is updated daily as new devices are{" "}
                <a href="/release-timeline">released</a>,{" "}
                <a href="/leaderboard">reviewed</a>, and added to the{" "}
                <a href="https://docs.google.com/spreadsheets/d/1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU/">
                  community datasheet
                </a>. Check the <a href="/release-timeline">release timeline</a>
                {" "}
                for the latest additions.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> Can I submit my own review?
              </summary>
              <p class="pl-8">
                Yes! <a href="/auth/sign-in">Sign in</a>{" "}
                or create an account, then visit any{" "}
                <a href="/devices">device page</a>{" "}
                to submit your review and rating.
              </p>
            </details>
          </div>
        </section>

        <section>
          <h2
            class="text-xl font-semibold mb-3"
            style={{
              color: "var(--pico-primary)",
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
                <PiInfo class="text-2xl" />{"  "}
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
                    </strong>:{" "}
                    You can also use the filters and sorting options to narrow
                    down devices by price, release year, brand, and more in the
                    {" "}
                    device catalog.
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
                by price, release year, brand, and more in the{" "}
                <a href="/devices">device catalog</a>.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" /> What are the most popular brands?
              </summary>
              <p class="pl-8">
                Popular brands include{" "}
                <a href="/devices?tags=anbernic">Anbernic</a>,{" "}
                <a href="/devices?tags=miyoo-bittboy">Miyoo</a>,{" "}
                <a href="/devices?tags=ayaneo">Ayaneo</a>,{" "}
                <a href="/devices?tags=powkiddy">Powkiddy</a>, and others.
                Browse all brands in the <a href="/devices">catalog</a>.
              </p>
            </details>
          </div>
        </section>

        <section>
          <h2
            class="text-xl font-semibold mb-3"
            style={{
              color: "var(--pico-primary)",
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
                Use our <a href="/compare">comparison tool</a>{" "}
                to select and compare technical specs, performance, and user
                reviews of different retro handhelds.
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiChartLine class="text-2xl" /> How does the ranking work?
              </summary>
              <div class="pl-8">
                <p>
                  The ranking is based on all relevant properties of the
                  devices.<br />
                  Every property is given a score and placed into a category.
                  The categories are then weighted and summed up to get the
                  final results.<br />
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
                    Blue means equal.
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
                    Green means better.
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
                    Red means worse.
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
