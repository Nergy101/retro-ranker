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
        {/* import Pico CSS classless*/}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.pumpkin.min.css"
        />
      </Head>
      <body>
        <header style={{ padding: "0" }}>
          <nav class="container-fluid">
            <ul>
              <li>
                <a href="/">
                  <img src="/logo.svg" alt="logo" height="32" />
                </a>
              </li>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/devices">Devices</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
            <ul>
              <li>
                <strong>Retro Ranker</strong>
              </li>
            </ul>
            <ul>
              <li>
                <input
                  type="search"
                  placeholder="Search..."
                  name="search"
                  aria-label="Search"
                />
              </li>
            </ul>
          </nav>
        </header>
        <main class="container">
          <Breadcrumb url={url} />
          <Component />
        </main>
        <footer>
          <div class="container">
            <div class="grid">
              <div>
                <h6>Retro Ranker</h6>
                <p>
                  Discover and Rank <br />
                  your favorite Retro Consoles and Games.
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
                    <a href="https://bluesky.social/retroranker">
                      <i class="ph ph-chat-text"></i>
                      <span>&nbsp;Bluesky</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="https://discord.gg/retroranker">
                      <i class="ph ph-discord-logo"></i>
                      <span>&nbsp;Discord</span>
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="https://github.com/retroranker">
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
