import SEO from "../components/SEO.tsx";

export default function Error500Page() {
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
          <h2>Refresh the page or try again later.</h2>
        </div>
      </article>
    </div>
  );
}
