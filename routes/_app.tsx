import { FreshContext, page } from "fresh";
import { User } from "@data/frontend/contracts/user.contract.ts";
import { CustomFreshState } from "@interfaces/state.ts";
import { Footer } from "@components/footer.tsx";
import { TopNavbar } from "@islands/navigation/top-navbar.tsx";

export const handler = {
  async GET(ctx: FreshContext) {
    return page(ctx);
  },
};

export default function AppWrapper(
  ctx: FreshContext,
) {
  const seo = (ctx.state as CustomFreshState).seo ?? {};

  // const state = ctx.state as CustomFreshState;
  const user = (ctx.state as CustomFreshState).user as User | null;
  const language = (ctx.state as CustomFreshState).language ?? "en-US";
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  const url = new URL(ctx.req.url);

  const page = (
    <html class="transition-colors" lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
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
            // deno-lint-ignore react-no-danger
            dangerouslySetInnerHTML={{ __html: seo.jsonLd }}
          />
        )}
        {/* Inline theme init to avoid flash of incorrect theme before first paint */}
        <script
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(globalThis.matchMedia&&globalThis.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();",
          }}
        />
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
        <script defer src="/scripts/lang-sync.js" />
        <script defer src="/scripts/card-effects.js" />
      </head>
      <body>
        <TopNavbar
          pathname={url.pathname}
          user={user}
          translations={translations}
        />
        <main class="main-content">
          {/* @ts-ignore */}
          <ctx.Component />
        </main>
        <Footer translations={translations} />
      </body>
    </html>
  );

  return page;
}
