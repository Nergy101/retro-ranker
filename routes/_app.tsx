import { Head } from "$fresh/runtime.ts";
import { type PageProps } from "$fresh/server.ts";
import { Breadcrumb } from "../islands/Breadcrumb.tsx";
import { DesktopNav } from "../islands/DesktopNav.tsx";
import { MobileNav } from "../islands/MobileNav.tsx";

export default function App({ Component, url }: PageProps) {
  return (
    <html class="transition-colors" lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="description"
          content="Find the perfect retro handheld gaming device for your needs. Compare specs, features, and performance of various retro gaming handhelds."
        />
        <title>Retro Ranker</title>

        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="Retro Ranker" />
        <meta
          property="og:description"
          content="Find the perfect retro handheld gaming device for your needs. Compare specs, features, and performance of various retro gaming handhelds."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://retroranker.site" />
        <meta
          property="og:image"
          content="https://retroranker.site/logo-color.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Retro Ranker" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Retro Ranker" />
        <meta
          name="twitter:description"
          content="Find the perfect retro handheld gaming device for your needs. Compare specs, features, and performance of various retro gaming handhelds."
        />
        <meta
          name="twitter:image"
          content="https://retroranker.site/logo-color.svg"
        />

        <link rel="stylesheet" href="/styles.css" />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
        <script
          defer
          src="https://umami.nergy.space/script.js"
          data-website-id="34d0e3cb-e9cf-4554-8b1c-27541fb877c0"
          data-domains="retroranker.site"
        >
        </script>
        <link
          defer
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          defer
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* import Pico CSS classless*/}
        <link
          defer
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.pumpkin.min.css"
        />
        {/* Prevent flash of wrong theme */}
        <script
          defer
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
                <strong>Retro Ranker</strong>
                <p>
                  Find the perfect device for your gaming needs.
                </p>
                <small>
                  © {new Date().getFullYear()}{" "}
                  Retro Ranker. All rights reserved.
                </small>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <small>
                    Made with ❤️ by{" "}
                    <span style={{ color: "var(--pico-primary)" }}>
                      Nergy101
                    </span>
                  </small>
                  <img
                    loading="lazy"
                    alt="nergy logo"
                    src="/nergy-logo.png"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  >
                  </img>
                </div>
              </div>
              <div class="footer-grid-item quick-links">
                <strong>Quick Links</strong>
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
                <strong>Connect</strong>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="https://bsky.app/profile/nergy101.bsky.social"
                      target="_blank"
                    >
                      <i class="ph ph-chat-text"></i>
                      <span>&nbsp;Bluesky</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="https://github.com/Nergy101/retro-ranker"
                      target="_blank"
                    >
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
