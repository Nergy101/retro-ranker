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
        <section>
          <h3>What is Retro Ranker?</h3>
          <p>
            Retro Ranker is a comprehensive database and comparison platform
            dedicated to retro handheld gaming devices. Our mission is to help
            enthusiasts discover and compare various retro gaming handhelds,
            making it easier to find the perfect device for your gaming needs.
          </p>
        </section>

        <section>
          <h3>Features</h3>
          <ul>
            <li>Detailed technical specifications for each device</li>
            <li>Performance ratings for different emulation capabilities</li>
            <li>Side-by-side device comparisons</li>
            <li>Real-world performance metrics and benchmarks</li>
            <li>Up-to-date pricing and availability information</li>
          </ul>
        </section>

        <section>
          <h3>Our Database</h3>
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
        </section>

        <section>
          <h3>Community Contribution</h3>
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
        </section>
      </div>
    </div>
  );
}
