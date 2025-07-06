import { VersionTag } from "@components/shared/version-tag.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import {
  PiCookie,
  PiDatabase,
  PiLink,
  PiListChecks,
  PiQuestion,
  PiStack,
  PiUsers,
} from "@preact-icons/pi";
import { FreshContext } from "fresh";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - About",
      description: "Learn about Retro Ranker's mission and our team.",
      url: "https://retroranker.site/about",
      keywords:
        "retro gaming database, handheld comparison, retro gaming community, emulation device reviews, retro gaming resources",
    };
    return page(ctx);
  },
};

export default function page(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};

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
              {TranslationPipe(translations, "nav.about")}
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
            {TranslationPipe(translations, "about.description")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div class="about-content">
        <details open>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiQuestion class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.whatIsRetroRanker")}
            </div>
          </summary>
          <p>
            {TranslationPipe(translations, "about.whatIsRetroRankerAnswer")}
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiStack class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.techStack")}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.deno")}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.fresh")}
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
                &nbsp;{TranslationPipe(
                  translations,
                  "about.techStack.pocketbase",
                )}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.picocss")}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.chartjs")}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.docker")}
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
                &nbsp;{TranslationPipe(translations, "about.techStack.hetzner")}
              </span>
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiListChecks class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.features")}
            </div>
          </summary>
          <ul>
            <li>
              {TranslationPipe(translations, "about.features.devices")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.favorites")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.reviews")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.specs")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.performance")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.comparisons")}
            </li>
            <li>
              {TranslationPipe(translations, "about.features.charts")}
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-4">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiQuestion class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.communityWebsites")}
            </div>
          </summary>
          <ul>
            <li class="flex items-center gap-2">
              {TranslationPipe(
                translations,
                "about.communityWebsites.retroCatalog",
              )}
              <a
                href="https://retrocatalog.com"
                target="_blank"
                data-tooltip="Retro Catalog"
                data-placement="right"
              >
                <PiLink class="text-3xl" />
              </a>
            </li>
            <li class="flex items-center gap-2">
              {TranslationPipe(
                translations,
                "about.communityWebsites.retroSizer",
              )}
              <a
                href="https://retrosizer.com"
                target="_blank"
                data-tooltip="Retro Sizer"
                data-placement="right"
              >
                <PiLink class="text-3xl" />
              </a>
            </li>
          </ul>
        </details>

        <details>
          <summary class="flex items-center gap-4">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiDatabase class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.dataSource")}
            </div>
          </summary>
          <p>
            {TranslationPipe(translations, "about.dataSource.description")}
            <br />
            <br />
            {TranslationPipe(translations, "about.dataSource.spreadsheet")}
            <br />
            {TranslationPipe(translations, "about.dataSource.accuracy")}
          </p>
          <section>
            <VersionTag />
          </section>
        </details>

        <details>
          <summary class="flex items-center gap-4">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiUsers class="text-3xl" />
              &nbsp;{TranslationPipe(
                translations,
                "about.communityContribution",
              )}
            </div>
          </summary>
          <p>
            {TranslationPipe(
              translations,
              "about.communityContribution.description",
            )}
            <br />
            <br />
            {TranslationPipe(
              translations,
              "about.communityContribution.discord",
            )}
          </p>
        </details>

        <details>
          <summary class="flex items-center gap-4">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PiCookie class="text-3xl" />
              &nbsp;{TranslationPipe(translations, "about.cookies")}
            </div>
          </summary>
          <p>
            {TranslationPipe(translations, "about.cookies.description")}
          </p>
        </details>
      </div>
    </div>
  );
}
