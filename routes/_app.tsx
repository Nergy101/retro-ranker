import { Head } from "$fresh/runtime.ts";
import { type PageProps } from "$fresh/server.ts";
import Footer from "../components/shared/Footer.tsx";
import { Breadcrumb } from "../islands/navigation/Breadcrumb.tsx";
import { Navbar } from "../islands/navigation/Navbar.tsx";
import { DeviceService } from "../services/devices/device.service.ts";

export default function App({ Component, url }: PageProps) {
  const allDevices = DeviceService.getInstance().getAllDevices()
  .sort((a, b) => a.name.raw.localeCompare(b.name.raw));

  return (
    <html class="transition-colors" lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          href="/pico.pumpkin.min.css"
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
        <Navbar pathname={url.pathname} allDevices={allDevices} />

        <main
          class="container content"
          style={{
            padding: "1em",
            borderRadius: "var(--pico-border-radius)",
          }}
        >
          <Breadcrumb />
          <Component />
        </main>

        <Footer />
      </body>
    </html>
  );
}
