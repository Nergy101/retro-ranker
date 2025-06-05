import {
  PiBook,
  PiChatText,
  PiCode,
  PiCodeBlock,
  PiCoffee,
  PiGithubLogo,
  PiLinkedinLogo,
} from "@preact-icons/pi";
import { FreshContext, page } from "fresh";
import { CustomFreshState } from "../interfaces/state.ts";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - Contact",
      description: "Contact us for inquiries or to contribute to our database.",
      keywords:
        "contact retro ranker, retro gaming support, handheld device inquiries, contribute to retro database, retro gaming community",
    };
    return page(ctx);
  },
};

export default function Contact() {
  return (
    <div class="contact">
      <section
        class="hero-section"
        style={{
          color: "#fff",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/rr-heart.png"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            <span style={{ color: "#F0F1F3" }}>Contact</span>{" "}
            <span style={{ color: "var(--pico-primary)", marginLeft: 8 }}>
              Retro Ranker
            </span>
            {" "}
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
            Have a question, want to contribute, or just want to say hi? <br />
            We love hearing from fellow retro fans!
          </p>
        </div>
      </section>

      <div>
        {/* Support Section */}
        <section style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            <img
              src="/logos/retro-ranker/rr-logo.png"
              alt="Coffee"
              style={{ width: 32, height: 48 }}
            />
            Support Retro Ranker
            <img
              src="/logos/retro-ranker/rr-logo.png"
              alt="Coffee"
              style={{ width: 32, height: 48 }}
            />
          </h3>
          <p style={{ textAlign: "center" }}>
            If you find Retro Ranker helpful and want to support its
            development, you can buy me a coffee or contribute to the project.
          </p>
          <div class="small-card-grid">
            <a
              href="https://ko-fi.com/nergy"
              target="_blank"
              class="small-card"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <PiCoffee class="text-4xl" />
              <span>Buy me a coffee</span>
            </a>
            <a
              href="https://github.com/Nergy101/retro-ranker"
              target="_blank"
              class="small-card"
              style={{
                textDecoration: "none",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <PiCode class="text-4xl" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </section>

        {/* Other Projects Section */}
        <section style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            <img
              src="/logos/nergy/nergy-n.png"
              alt="Star"
              style={{ width: 32, height: 32 }}
            />
            My Other Projects
            <img
              src="/logos/nergy/nergy-n.png"
              alt="Heart"
              style={{ width: 32, height: 32 }}
            />
          </h3>
          <div class="small-card-grid">
            <a
              href="https://portfolio.nergy.space"
              target="_blank"
              class="small-card"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <PiCodeBlock class="text-4xl" />
              <span>Portfolio</span>
            </a>
            <a
              href="https://blog.nergy.space"
              target="_blank"
              class="small-card"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <PiBook class="text-4xl" />
              <span>Blog</span>
            </a>
          </div>
        </section>

        {/* Connect Section */}
        <section>
          <h3
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            Connect With Me
          </h3>
          <div class="small-card-grid">
            <a
              href="https://bsky.app/profile/nergy101.bsky.social"
              target="_blank"
              class="small-card"
              style={{
                textDecoration: "none",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <PiChatText class="text-4xl" />
              <span>BlueSky</span>
            </a>
            <a
              href="https://www.linkedin.com/in/christian-van-dijk-657069134/"
              target="_blank"
              class="small-card"
              style={{
                textDecoration: "none",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <PiLinkedinLogo class="text-4xl" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/Nergy101"
              target="_blank"
              class="small-card"
              style={{
                textDecoration: "none",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <PiGithubLogo class="text-4xl" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
