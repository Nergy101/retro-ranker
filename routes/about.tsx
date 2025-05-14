import SEO from "../components/SEO.tsx";
import {
  PiCookie,
  PiDatabase,
  PiListChecks,
  PiQuestion,
  PiStack,
  PiUsers,
} from "@preact-icons/pi";
import { PageProps } from "$fresh/server.ts";

export default function About({ url }: PageProps) {
  return (
    <div class="about">
      <SEO
        title="About"
        description="Learn about Retro Ranker's mission and our team."
        url={`https://retroranker.site${url.pathname}`}
        keywords="retro gaming database, handheld comparison, retro gaming community, emulation device reviews, retro gaming resources"
      />

      <h1 class="text-3xl font-bold mb-6" style={{ textAlign: "center" }}>
        About <span style={{ color: "var(--pico-primary)" }}>Retro Ranker</span>
      </h1>

      <div class="flex justify-center" style={{ marginBottom: "2rem" }}>
        <figure
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src="/logo-color.png"
              alt="Retro Ranker Logo"
              width="200"
              height="200"
              class="max-w-full h-auto"
              style={{
                borderRadius: "1rem",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "5rem",
              color: "var(--pico-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 1rem",
            }}
          >
            +
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <a href="https://retro-handhelds.com" target="_blank">
              <img
                src="/images/rh-logo-text.png"
                alt="Retro Handhelds Community Logo"
                width="200"
                height="200"
                class="max-w-full h-auto"
                style={{
                  borderRadius: "1rem",
                }}
              />
            </a>
          </div>
        </figure>
      </div>

      <div>
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
            enthusiasts discover and compare various retro gaming handhelds,
            making it easier to find the perfect device for your gaming needs.
          </p>
        </details>

        <details open>
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
                &nbsp;Deno (Deploy) - A secure runtime for JavaScript and
                TypeScript
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
            <li class="flex items-center gap-4">
              <img
                loading="lazy"
                src="/stack/chartjs.svg"
                alt="Chart.js"
                width="32"
                height="32"
              />
              <span>
                &nbsp;Chart.js - JavaScript library for building charts
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
            <li>Detailed technical specifications for each device</li>
            <li>Performance ratings for different emulation capabilities</li>
            <li>Side-by-side device comparisons</li>
            <li>
              Charts and graphs to visualize device performance and
              specifications
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
              <PiQuestion class="text-3xl" />
              &nbsp;This website looks a lot like...
            </div>
          </summary>
          <p>
            I'm a big fan of the work done by Jipsony on his website{" "}
            <a href="https://retrocatalog.com/" class="text-primary">
              Retro Catalog
            </a>
            .
            <br />
            I've borrowed some of his ideas for this website.
            <br />
            In the end, I'm just hoping to be of some help to the community.
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
