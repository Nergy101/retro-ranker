import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";

export interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
  robots?: string;
  jsonLd?: string;
  children?: ComponentChildren;
}

export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  robots,
  jsonLd,
  children,
}: SEOProps) {
  const defaultTitle = "Retro Ranker";
  const defaultDescription =
    "Browse and compare retro gaming handhelds. Find detailed specifications, performance ratings, and prices for devices.";
  const defaultUrl = "https://retroranker.site";
  const defaultImage = "https://retroranker.site/logo-color.png";
  const defaultKeywords =
    "retro gaming, handheld consoles, emulation devices, retro handhelds, gaming comparison";
  const defaultRobots = "index, follow";

  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullUrl = url || defaultUrl;
  const fullImage = image || defaultImage;
  const fullKeywords = keywords || defaultKeywords;
  const fullRobots = robots || defaultRobots;

  return (
    <Head>
      <title>{fullTitle}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta name="description" content={fullDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="robots" content={fullRobots} />
      {jsonLd && (
        <script
          type="application/ld+json"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <link rel="canonical" href={fullUrl} />
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
        // deno-lint-ignore react-no-danger
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
      {children}
    </Head>
  );
}
