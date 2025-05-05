import { PageProps } from "$fresh/server.ts";
import { PiArrowClockwise, PiGameControllerBold } from "@preact-icons/pi";
import SEO from "../components/SEO.tsx";

export default function Error404(props: PageProps) {
  return (
    <div class="not-found">
      <SEO
        title="404 Page Not Found"
        description="The page you were looking for doesn't exist on Retro Ranker. Return to our homepage to browse retro gaming handhelds and comparison tools."
        robots="noindex, nofollow"
      />
      <article>
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <span>
            The page you were looking for doesn't exist.
          </span>
          <a
            role="button"
            href="/"
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              textDecoration: "none",
              marginTop: "1rem",
              color: "var(--pico-color)",
            }}
          >
            <PiGameControllerBold />
            Go back home
          </a>
          <a
            type="button"
            role="button"
            href={props.url.pathname}
            class="outline"
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              textDecoration: "none",
              marginTop: "1rem",
            }}
          >
            <PiArrowClockwise />
            Reload page
          </a>
        </div>
      </article>
    </div>
  );
}
