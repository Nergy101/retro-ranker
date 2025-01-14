import { Head } from "$fresh/runtime.ts";
import { type PageProps } from "$fresh/server.ts";
import { Breadcrumb } from "../islands/Breadcrumb.tsx";
import { DesktopNav } from "../islands/DesktopNav.tsx";
import { MobileNav } from "../islands/MobileNav.tsx";

export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <title>Retro Ranker</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* import Pico CSS classless*/}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.pumpkin.min.css"
        />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const savedTheme = localStorage.getItem('theme');
              if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `,
          }}
        />
      </Head>
      <body>
        <header
          style={{
            padding: "0",
            borderBottom: "1px solid var(--pico-primary)",
          }}
        >
          {/* Desktop Navigation */}
          <DesktopNav pathname={url.pathname} />

          {/* Mobile Navigation */}
          <MobileNav pathname={url.pathname} />
        </header>
        <main class="container">
          <Breadcrumb />
          <Component />
        </main>
        <footer style={{ borderTop: "1px solid var(--pico-primary)" }}>
          <div class="container-fluid">
            <div class="footer-grid">
              <div class="footer-grid-item rr">
                <h6>Retro Ranker</h6>
                <p>
                  Find the perfect device for your gaming needs.
                </p>
                <small>
                  © {new Date().getFullYear()}{" "}
                  Retro Ranker. All rights reserved.
                </small>
              </div>
              <div class="footer-grid-item quick-links">
                <h6>Quick Links</h6>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ listStyle: "none" }}>
                    <a href="/about">
                      <i class="ph ph-info"></i>
                      <span>&nbsp;About</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="/privacy">
                      <i class="ph ph-shield"></i>
                      <span>&nbsp;Privacy Policy</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="/terms">
                      <i class="ph ph-file-text"></i>
                      <span>&nbsp;Terms of Service</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="footer-grid-item connect">
                <h6>Connect</h6>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ listStyle: "none" }}>
                    <a href="https://bsky.app/profile/nergy101.bsky.social">
                      <i class="ph ph-chat-text"></i>
                      <span>&nbsp;Bluesky</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="https://github.com/Nergy101/retro-ranker">
                      <i class="ph ph-github-logo"></i>
                      <span>&nbsp;GitHub</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
