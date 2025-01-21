import { Head } from "$fresh/runtime.ts";
import {
  PiChatText,
  PiCoffee,
  PiGithubLogo,
  PiLinkedinLogo,
} from "@preact-icons/pi";

export default function ContactPage() {
  return (
    <div class="mx-auto max-w-screen-md">
      <Head>
        <title>Retro Ranker - Contact</title>
      </Head>

      <h1 class="text-3xl font-bold">
        Get in Touch
      </h1>

      <div>
        <section>
          <h3>Support My Work</h3>
          <p>
            If you find Retro Ranker helpful and want to support its
            development, you can buy me a coffee or contribute to the project.
          </p>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <a
              href="https://ko-fi.com/nergy"
              target="_blank"
              class="small-card"
              style="text-decoration: none; justify-content: center;"
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
              <PiGithubLogo class="text-4xl" />
              <span>
                GitHub Repository
              </span>
            </a>
          </div>
        </section>

        <section>
          <h3>My Other Projects</h3>
          <ul>
            <li>
              <a
                href="https://portfolio.nergy.space"
                target="_blank"
                class="text-primary"
              >
                Portfolio
              </a>
              &nbsp;- My portfolio website
            </li>
            <li>
              <a
                href="https://blog.nergy.space"
                target="_blank"
                class="text-primary"
              >
                Blog
              </a>
              &nbsp;- My blog website
            </li>
          </ul>
        </section>

        <section>
          <h3>Connect With Me</h3>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
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
              style="text-decoration: none; text-align: center; justify-content: center;"
            >
              <PiLinkedinLogo class="text-4xl" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/Nergy101"
              target="_blank"
              class="small-card"
              style="text-decoration: none; text-align: center; justify-content: center;"
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
