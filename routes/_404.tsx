import { Head } from "$fresh/runtime.ts";
import { PiGameControllerBold } from "@preact-icons/pi";

export default function Error404() {
  return (
    <>
      <Head>
        <title>Retro Ranker - 404 Page Not Found</title>
        <meta
          name="description"
          content="The page you were looking for doesn't exist."
        />
      </Head>
      <div class="bg-rr-primary">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <span style={{ color: "var(--pico-primary-inverse)" }}>
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
              color: "var(--pico-primary-inverse)",
            }}
          >
            <PiGameControllerBold />
            &nbsp;Go back home
          </a>
        </div>
      </div>
    </>
  );
}
