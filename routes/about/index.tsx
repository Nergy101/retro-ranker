import {
  PiCookie,
  PiDatabase,
  PiListChecks,
  PiQuestion,
  PiStack,
  PiUsers,
} from "@preact-icons/pi";
import { FreshContext } from "fresh";
import { CustomFreshState } from "../../interfaces/state.ts";
import { VersionTag } from "../../components/shared/version-tag.tsx";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - About",
      description: "Learn about Retro Ranker's mission and our team.",
      url: "https://retroranker.site/about",
      keywords:
        "retro gaming database, handheld comparison, retro gaming community, emulation device reviews, retro gaming resources",
    };
    return page();
  },
};

export default function page() {
  return (
    <div class="about">
      {/* Hero Section */}
      <section
        class="hero-section"
        style={{
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            class="flex justify-center"
            style={{
              marginBottom: "1.5rem",
              gap: "2rem",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <a href="https://retro-handhelds.com" target="_blank">
              <img
                src="/logos/retro-handhelds/rh-logo-text.png"
                alt="Retro Handhelds Community Logo"
                width="160"
                height="160"
                class="max-w-full h-auto"
                style={{ borderRadius: "1rem" }}
              />
            </a>
            <div
              style={{
                fontSize: "4rem",
                color: "var(--pico-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 1rem",
              }}
            >
              +
            </div>

            <img
              src="/logos/retro-ranker/rr-logo.svg"
              alt="Retro Ranker Logo"
              width="120"
              height="120"
              class="max-w-full h-auto"
              style={{ borderRadius: "1rem" }}
            />
          </div>
          <h1
            class="text-3xl font-bold"
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            <span
              style={{
                color: "#F0F1F3",
              }}
            >
              About
            </span>{" "}
            <span style={{ color: "var(--pico-primary)", marginLeft: 8 }}>
              Retro Ranker
            </span>
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#fff",
              opacity: 0.95,
            }}
          >
            Learn about our mission, our partnership with the Retro Handhelds
            community, and what makes this project special.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div class="about-content">
        <details open>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiQuestion class="text-3xl" />
              &nbsp;What is Retro Ranker?
            </div>
          </summary>
          <p>
            Retro Ranker is a comprehensive database and comparison platform
            dedicated to retro handheld gaming devices. Our mission is to help
            enthusiasts rank, discover and compare various retro gaming
            handhelds, making it easier to find the perfect device for your
            gaming needs.
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiStack class="text-3xl" />
              &nbsp;Tech Stack
            </div>
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
                &nbsp;<b>Deno</b> - A secure runtime for <b>JavaScript</b> and
                {" "}
                <b>TypeScript</b>
              </span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/fresh.svg"
                alt="Fresh"
                width="32"
                height="32"
              />
              <span>
                &nbsp;<b>Fresh</b> - The next-gen <b>web framework</b>
              </span>
            </li>

            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/pocketbase.svg"
                alt="PocketBase"
                width="32"
                height="32"
              />
              <span>
                &nbsp;<b>PocketBase</b> - A <b>lightweight</b>, open-source{" "}
                <b>database</b>
              </span>
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
                &nbsp;<b>PicoCSS</b> - <b>Minimal CSS Framework</b>{" "}
                for semantic HTML
              </span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/chartjs.svg"
                alt="Chart.js"
                width="32"
                height="32"
              />
              <span>
                &nbsp;<b>Chart.js</b> - JavaScript library for building{" "}
                <b>charts</b>
              </span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/docker.svg"
                alt="Docker"
                width="32"
                height="32"
              />
              <span>
                &nbsp;<b>Docker</b> - Containerization for <b>deployment</b>
              </span>
            </li>
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/hetzner.svg"
                alt="Hetzner"
                width="32"
                height="32"
              />
              <span>
                &nbsp;<b>Hetzner</b> - <b>Cloud</b> hosting
              </span>
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiListChecks class="text-3xl" />
              &nbsp;Features
            </div>
          </summary>
          <ul>
            <li>
              <b>400+</b> retro handhelds to search through
            </li>
            <li>
              Save your <b>favorite devices</b> and <b>manage collections</b>
            </li>
            <li>
              Leave <b>comments, reviews and ratings</b> for devices
            </li>
            <li>
              <b>Detailed technical specifications</b> for each device
            </li>
            <li>
              <b>Performance ratings</b> for different emulation capabilities
            </li>
            <li>
              Side-by-side <b>device comparisons</b>
            </li>
            <li>
              <b>Charts and graphs</b>{" "}
              to visualize device performance and specifications
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiQuestion class="text-3xl" />
              &nbsp;Community websites made by others
            </div>
          </summary>
          <ul>
            <li>
              I'm a big fan of <em>Jipsony's</em> website{" "}
              <a
                href="https://retrocatalog.com/"
                target="_blank"
                class="text-primary"
              >
                Retro Catalog
              </a>. <br /> The original inspiration for this website.
            </li>
            <li>
              Looking for accurate size comparisons?<br />
              <a
                href="https://retrosizer.com/"
                target="_blank"
                class="text-primary"
              >
                RetroSizer
              </a>{" "}
              by <em>beetlefeet/jackcasey</em> should help you out.
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiDatabase class="text-3xl" />
              &nbsp;Where does the data come from?
            </div>
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
            community.
            <br />
            <br />
            We particularly draw from their comprehensive{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU/"
              target="_blank"
            >
              Handhelds Overview
            </a>
            , which serves as the foundation for our device specifications and
            performance ratings.
            <br />
            By using this data, we ensure our data remains accurate and
            up-to-date with the latest developments in the retro handheld scene.
          </p>
          <section>
            <VersionTag />
          </section>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiUsers class="text-3xl" />
              &nbsp;Community Contribution
            </div>
          </summary>
          <p>
            We encourage you to join the Retro Handhelds community to contribute
            to this growing knowledge base. Their collective expertise and
            hands-on experience with these devices help maintain the accuracy
            and reliability of our information.
            <br />
            <br />
            Visit their{" "}
            <a href="https://discord.gg/retrohandhelds" class="text-primary">
              Discord
            </a>{" "}
            to connect with fellow enthusiasts and share your experiences.
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiCookie class="text-3xl" />
              &nbsp;Cookies
            </div>
          </summary>
          <p>
            Retro Ranker uses{" "}
            <a href="https://umami.is" target="_blank">
              Umami
            </a>
            , a privacy-focused analytics tool, to track usage.{" "}
            <br />It's open source and self-hosted, all data collection is
            anonymous and GDPR compliant. Hence why we don't need a cookie
            banner!
          </p>
        </details>
      </div>
    </div>
  );
}
