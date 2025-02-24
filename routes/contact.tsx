import { PageProps } from "$fresh/server.ts";
import {
  PiBook,
  PiChatText,
  PiCode,
  PiCodeBlock,
  PiCoffee,
  PiGithubLogo,
  PiLinkedinLogo,
} from "@preact-icons/pi";
import SEO from "../components/SEO.tsx";

export default function Contact({ url }: PageProps) {
  return (
    <div class="contact">
      <SEO
        title="Contact"
        description="Contact Retro Ranker for inquiries and support."
        url={`https://retroranker.site${url.pathname}`}
      />

      <h1 class="text-3xl font-bold" style={{ textAlign: "center" }}>
        Contact
      </h1>

      <div>
        <section>
          <h3 style={{ textAlign: "center" }}>Support My Work</h3>
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
              style="text-decoration: none; text-align: center; justify-content: center;"
            >
              <PiCode class="text-4xl" />
              <span>
                GitHub Repository
              </span>
            </a>
          </div>
        </section>

        <section>
          <h3 style={{ textAlign: "center" }}>My Other Projects</h3>
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
            >
              <PiBook class="text-4xl" />
              <span>Blog</span>
            </a>
          </div>
        </section>

        <section>
          <h3 style={{ textAlign: "center" }}>Connect With Me</h3>
          <div class="small-card-grid">
            <a
              href="https://bsky.app/profile/nergy101.bsky.social"
              target="_blank"
              class="small-card"
              style="text-decoration: none; text-align: center; justify-content: center;"
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
