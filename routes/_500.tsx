import { PageProps } from "$fresh/server.ts";
import { PiGameControllerBold } from "@preact-icons/pi";
import SEO from "../components/SEO.tsx";

export default function Error500Page(props: PageProps) {
  return (
    <div class="not-found">
      <SEO
        title="Error"
        description="An error occurred on Retro Ranker. Please try again later."
        robots="noindex, nofollow"
      />
      <article>
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">Error</h1>
          <span>
            An error occurred on Retro Ranker. Please try again later.
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
        </div>
      </article>
    </div>
  );
}
