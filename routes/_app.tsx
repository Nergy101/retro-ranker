import { FreshContext, page } from "fresh";
import Footer from "../components/shared/Footer.tsx";
import { Device } from "../data/frontend/contracts/device.model.ts";
import { User } from "../data/frontend/contracts/user.contract.ts";
import { DeviceService } from "../data/frontend/services/devices/device.service.ts";
import { CustomFreshState } from "../interfaces/state.ts";
import { Navbar } from "../islands/navigation/Navbar.tsx";

interface Seo {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  url: string;
}

export const handler = {
  async GET(ctx: FreshContext) {
    const deviceService = await DeviceService.getInstance();
    const allDevices = await deviceService.getAllDevices();
    (ctx.params as any) = {
      allDevices,
    };
    return page();
  },
};

export default function AppWrapper(
  ctx: FreshContext,
) {
  const seo = (ctx.state as CustomFreshState).seo ?? {};

  // const state = ctx.state as CustomFreshState;
  const params = ctx.params as any;
  const allDevices = params.allDevices as Device[];
  const user = (ctx.state as CustomFreshState).user as User | null;
  const url = new URL(ctx.req.url);

  const page = (
    <html class="transition-colors" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {seo.title && <title>{seo.title}</title>}
        {seo.description && (
          <meta name="description" content={seo.description} />
        )}
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        {seo.robots && <meta name="robots" content={seo.robots} />}
        {seo.url && <link rel="canonical" href={seo.url} />}
        {seo.image && <meta property="og:image" content={seo.image} />}
        {seo.title && <meta property="og:title" content={seo.title} />}
        {seo.description && (
          <meta property="og:description" content={seo.description} />
        )}
        <meta property="og:type" content="website" />
        {seo.url && <meta property="og:url" content={seo.url} />}
        <meta property="og:site_name" content="Retro Ranker" />
        <meta name="twitter:card" content="summary_large_image" />
        {seo.title && <meta name="twitter:title" content={seo.title} />}
        {seo.description && (
          <meta name="twitter:description" content={seo.description} />
        )}
        {seo.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: seo.jsonLd }}
          />
        )}
        <link rel="stylesheet" href="/styles.css" />
        <script defer src="/scripts/konami.js" />
        <script
          defer
          src="https://umami.nergy.space/script.js"
          data-website-id="34d0e3cb-e9cf-4554-8b1c-27541fb877c0"
          data-domains="retroranker.site"
        />
        <script src="https://cdn.jsdelivr.net/npm/@cap.js/widget"></script>
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
        <link rel="stylesheet" href="/pico.pumpkin.min.css" />
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
      </head>
      <body>
        {/* <Navbar
          pathname={url.pathname}
          allDevices={allDevices}
          user={user}
        /> */}
        <main class="main-content">
          {/* @ts-ignore */}
          <ctx.Component />
        </main>
        <Footer />
      </body>
    </html>
  );

  return page;
}
