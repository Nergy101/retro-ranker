import {
  PiChatText,
  PiFileText,
  PiGithubLogo,
  PiInfo,
  PiQuestion,
  PiShield,
} from "@preact-icons/pi";
import { VersionTag } from "./shared/version-tag.tsx";
export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--pico-primary)",
        backgroundColor: "var(--pico-card-background-color-darker)",
      }}
      class="footer"
    >
      <div class="container-fluid">
        <div class="footer-grid">
          <div
            class="footer-grid-item quick-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Other</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/privacy">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiShield />
                    <span>
                      Privacy
                    </span>
                  </div>
                </a>
              </li>

              <li style={{ listStyle: "none" }}>
                <a href="/terms">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiFileText />
                    <span>
                      ToS
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item connect-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Connect</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://bsky.app/profile/nergy101.bsky.social"
                  target="_blank"
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiChatText />
                    <span>
                      Bluesky
                    </span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://github.com/Nergy101/retro-ranker"
                  target="_blank"
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiGithubLogo />
                    <span>
                      GitHub
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item more-links"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>More</span>
            <ul class="footer-grid-item-list">
              <li style={{ listStyle: "none" }}>
                <a href="/about">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiInfo />
                    <span>
                      About
                    </span>
                  </div>
                </a>
                <a href="/faq">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PiQuestion />
                    <span>
                      FAQ
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div
            class="footer-grid-item version-info"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>All rights reserved.</span>
            <span>
              Made with ❤️ by <a href="https://github.com/Nergy101">Nergy101</a>
            </span>
            <VersionTag />
          </div>
        </div>
      </div>
    </footer>
  );
}
