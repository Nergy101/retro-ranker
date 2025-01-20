import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>Retro Ranker - 404 Page Not Found</title>
      </Head>
      <div class="px-4 py-8 mx-auto bg-deno-green">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            loading="lazy"
            src="/logo-color.svg"
            width="128"
            height="128"
            alt="the RetroRanker logo; a gameboy with a ranking icon on its screen"
          />
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <strong style={{ color: "#000" }}>
            The page you were looking for doesn't exist.
          </strong>
          <a href="/">
            <i class="ph-bold ph-game-controller"></i>
            &nbsp;Go back home
          </a>
        </div>
      </div>
    </>
  );
}
