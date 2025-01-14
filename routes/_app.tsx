import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Breadcrumb from "../components/Breadcrumb.tsx";
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
      </Head>
      <body>
        <header style={{ padding: "0" }}>
          <nav class="container">
            <ul>
              <li>
                <a href="/">
                  <img
                    src="/logo-color.svg"
                    alt="logo"
                    style={{ height: "5em" }}
                  />
                </a>
              </li>
              <li>
                <a href="/" class={url.pathname === "/" ? "active" : ""}>
                  <i class="ph ph-house"></i>
                  &nbsp;Home
                </a>
              </li>
              <li>
                <a
                  href="/devices"
                  class={url.pathname.startsWith("/devices") ? "active" : ""}
                >
                  <i class="ph ph-devices"></i>
                  &nbsp;Devices
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  class={url.pathname === "/about" ? "active" : ""}
                >
                  <i class="ph ph-info"></i>
                  &nbsp;About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  class={url.pathname === "/contact" ? "active" : ""}
                >
                  <i class="ph ph-user"></i>
                  &nbsp;Contact
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <form action="/devices" method="get">
                  <input
                    type="search"
                    placeholder="Search..."
                    name="q"
                    aria-label="Search"
                  />
                </form>
              </li>
            </ul>
          </nav>
        </header>
        <main class="container">
          <Breadcrumb url={url} />
          <Component />
        </main>
        <footer>
          <div class="container-fluid">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div>
                <h6>Retro Ranker</h6>
                <p>
                  Find the perfect device for your gaming needs
                </p>
                <small>
                  © {new Date().getFullYear()}{" "}
                  Retro Ranker. All rights reserved.
                </small>
              </div>
              <div>
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
              <div>
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
