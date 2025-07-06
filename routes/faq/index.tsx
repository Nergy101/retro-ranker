import { PiChartLine, PiInfo, PiQuestion } from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - FAQ",
      description: "Frequently Asked Questions (FAQ)",
      keywords:
        "retro ranker faq, retro gaming questions, handheld comparison help, device catalog faq, emulation device questions",
    };
    return page(ctx);
  },
};

export default function FAQ(ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  return (
    <div class="faq">
      <section
        class="hero-section"
        style={{
          color: "#fff",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "1.5rem",
        }}
      >
        <img
          src="/images/rr-star.png"
          alt="Retro Ranker Welcome"
          style={{
            position: "absolute",
            right: -100,
            bottom: -200,
            maxWidth: "350px",
            width: "40vw",
            opacity: 0.18,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1
            class="text-3xl font-bold"
            style={{
              textAlign: "center",
              color: "#F0F1F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            {TranslationPipe(translations, "faq.title")}
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
            {TranslationPipe(translations, "faq.description")}
          </p>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/about"
              class="hero-button"
            >
              {TranslationPipe(translations, "nav.about")}
            </a>
            <a
              href="/contact"
              class="hero-button"
            >
              {TranslationPipe(translations, "nav.contact")}
            </a>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <div class="faq-content">
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
            <PiQuestion class="text-2xl" />{" "}
            {TranslationPipe(translations, "faq.general")}
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiQuestion class="text-2xl" /> {TranslationPipe(
                  translations,
                  "faq.whatIsRetroRanker",
                )}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.whatIsRetroRankerAnswer")}
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.whichBrands")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.whichBrandsAnswer")}
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.howOftenUpdated")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.howOftenUpdatedAnswer")}
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.canSubmitReview")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.canSubmitReviewAnswer")}
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
            <PiInfo class="text-2xl" />{" "}
            {TranslationPipe(translations, "faq.devicesAndCatalog")}
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{"  "}
                {TranslationPipe(translations, "faq.howToSearch")}
              </summary>
              <p class="pl-8">
                <ul>
                  <li>
                    <strong>
                      {TranslationPipe(translations, "faq.quickSearch")}
                    </strong>{" "}
                    {TranslationPipe(translations, "faq.quickSearchDesc")}
                  </li>
                  <li>
                    <strong>
                      <a href="/devices">
                        {TranslationPipe(translations, "faq.advancedSearch")}
                      </a>
                    </strong>:{" "}
                    {TranslationPipe(translations, "faq.advancedSearchDesc")}
                  </li>
                </ul>
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.canFilterDevices")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.canFilterDevicesAnswer")}
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiInfo class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.popularBrands")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.popularBrandsAnswer")}
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
            <PiChartLine class="text-2xl" />{" "}
            {TranslationPipe(translations, "faq.deviceComparison")}
          </h2>
          <div class="flex flex-col gap-4">
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiChartLine class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.howToCompare")}
              </summary>
              <p class="pl-8">
                {TranslationPipe(translations, "faq.howToCompareAnswer")}
              </p>
            </details>
            <details class="faq-details">
              <summary class="flex items-center gap-2">
                <PiChartLine class="text-2xl" />{" "}
                {TranslationPipe(translations, "faq.howRankingWorks")}
              </summary>
              <div class="pl-8">
                <p>
                  {TranslationPipe(translations, "faq.rankingExplanation")}
                  <br />
                  <strong>
                    {TranslationPipe(translations, "faq.categoryWeightsTitle")}
                  </strong>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <ul>
                      <li>
                        {TranslationPipe(translations, "faq.performance")}
                      </li>
                      <li>{TranslationPipe(translations, "faq.monitor")}</li>
                      <li>{TranslationPipe(translations, "faq.dimensions")}</li>
                    </ul>
                    <ul>
                      <li>
                        {TranslationPipe(translations, "faq.connectivity")}
                      </li>
                      <li>{TranslationPipe(translations, "faq.audio")}</li>
                      <li>{TranslationPipe(translations, "faq.controls")}</li>
                    </ul>
                    <ul>
                      <li>{TranslationPipe(translations, "faq.misc")}</li>
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
                    {TranslationPipe(translations, "faq.blueMeansEqual")}
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
                    {TranslationPipe(translations, "faq.greenMeansBetter")}
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
                    {TranslationPipe(translations, "faq.redMeansWorse")}
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
