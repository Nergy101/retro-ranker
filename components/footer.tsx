import {
  PiChatText,
  PiFileText,
  PiGithubLogo,
  PiShield,
} from "@preact-icons/pi";

export function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid var(--pico-primary)" }}
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
            <strong>Other</strong>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ listStyle: "none" }}>
                <a href="/privacy">
                  <div style={{ display: "flex" }}>
                    <PiShield />
                    <span>&nbsp;Privacy</span>
                  </div>
                </a>
              </li>

              <li style={{ listStyle: "none" }}>
                <a href="/terms">
                  <div style={{ display: "flex" }}>
                    <PiFileText />
                    <span>&nbsp;ToS</span>
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
            <strong>Connect</strong>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://bsky.app/profile/nergy101.bsky.social"
                  target="_blank"
                >
                  <div style={{ display: "flex" }}>
                    <PiChatText />
                    <span>&nbsp;Bluesky</span>
                  </div>
                </a>
              </li>
              <li style={{ listStyle: "none" }}>
                <a
                  href="https://github.com/Nergy101/retro-ranker"
                  target="_blank"
                >
                  <div style={{ display: "flex" }}>
                    <PiGithubLogo />
                    <span>&nbsp;GitHub</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-grid-item rr">
            <strong style={{ color: "var(--pico-primary)" }}>
              Retro Ranker
            </strong>
            <small>
              © {new Date().getFullYear()}{" "}
              <a
                style={{ color: "var(--pico-primary)" }}
                href="https://retroranker.site"
                target="_blank"
              >
                Retro Ranker
              </a>. All rights reserved.
            </small>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <small>
                Made with ❤️ by{" "}
                <span style={{ color: "var(--pico-primary)" }}>
                  <a href="https://portfolio.nergy.space" target="_blank">
                    Nergy101
                  </a>
                </span>
              </small>
              <img
                loading="lazy"
                alt="nergy logo"
                src="/logos/nergy/nergy-square.png"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
