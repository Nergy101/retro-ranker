import { Head } from "$fresh/runtime.ts";

export default function AboutPage() {
  return (
    <div class="mx-auto max-w-screen-md">
      <Head>
        <title>
          About <span style="color: var(--pico-primary);">Retro Ranker</span>
        </title>
      </Head>

      <h1 class="text-3xl font-bold mb-6">
        About <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span>
      </h1>

      <div>
        <details open>
          <summary class="flex items-center gap-2">
            <i class="ph ph-question"></i>&nbsp;What is Retro Ranker?
          </summary>
          <p>
            Retro Ranker is a comprehensive database and comparison platform
            dedicated to retro handheld gaming devices. Our mission is to help
            enthusiasts discover and compare various retro gaming handhelds,
            making it easier to find the perfect device for your gaming needs.
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <i class="ph ph-list-checks"></i>&nbsp;Features
          </summary>
          <ul>
            <li>Detailed technical specifications for each device</li>
            <li>Performance ratings for different emulation capabilities</li>
            <li>Side-by-side device comparisons</li>
            <li>Real-world performance metrics and benchmarks</li>
            <li>Up-to-date pricing and availability information</li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <i class="ph ph-stack"></i>&nbsp;Tech Stack
          </summary>
          <ul class="flex flex-col gap-4 p-4">
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/deno.gif"
                alt="Deno"
                width="32"
                height="32"
              />
              <span>
                &nbsp;Deno - A secure runtime for JavaScript and TypeScript
              </span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/deno.gif"
                alt="Deno"
                width="32"
                height="32"
              />
              <span>&nbsp;Deno Deploy - Global edge deployment platform</span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/fresh.svg"
                alt="Fresh"
                width="32"
                height="32"
              />
              <span>&nbsp;Fresh - The next-gen web framework</span>
            </li>

            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/pico.svg"
                alt="PicoCSS"
                width="32"
                height="32"
              />
              <span>
                &nbsp;PicoCSS - Minimal CSS Framework for semantic HTML
              </span>
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <i class="ph ph-database"></i>&nbsp;Where does the data come from?
          </summary>
          <p>
            Retro Ranker's database is powered by the incredible work of the
            {" "}
            <a
              href="https://retro-handhelds.com"
              target="_blank"
              class="text-primary"
            >
              Retro Handhelds
            </a>{" "}
            community. We particularly draw from their comprehensive Handhelds
            Overview, which serves as the foundation for our device
            specifications and performance ratings. This collaboration ensures
            our data remains accurate and up-to-date with the latest
            developments in the retro handheld scene.
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <i class="ph ph-users"></i>&nbsp;Community Contribution
          </summary>
          <p>
            We encourage you to join the Retro Handhelds community to contribute
            to this growing knowledge base. Their collective expertise and
            hands-on experience with these devices help maintain the accuracy
            and reliability of our information. Visit their{" "}
            <a href="https://discord.gg/retrohandhelds" class="text-primary">
              Discord
            </a>{" "}
            to connect with fellow enthusiasts and share your experiences.
          </p>
        </details>
      </div>
    </div>
  );
}
