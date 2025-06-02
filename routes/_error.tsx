import { FreshContext, HttpError, page, PageProps } from "fresh";
import { CustomFreshState } from "../interfaces/state.ts";
// import SEO from "../components/SEO.tsx";

export const handler = {
  GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Error",
      description: "An error occurred on Retro Ranker. Please try again later.",
      robots: "noindex, nofollow",
    };
    return page(ctx);
  },
};

export default function ErrorPage(props: PageProps) {
  const { error } = props;

  const renderNotFound = () => {
    return (
      <div class="not-found">
        {/* <SEO
          title="404 Page Not Found"
          description="The page you were looking for doesn't exist on Retro Ranker. Return to our homepage to browse retro gaming handhelds and comparison tools."
          robots="noindex, nofollow"
        /> */}
        <article>
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold">404 - Page not found</h1>
            <span>
              The page you were looking for doesn't exist.
            </span>
            <h2>
              Return to our homepage to browse retro gaming handhelds and
              comparison tools.
            </h2>
          </div>
        </article>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div class="not-found">
        {/* <SEO
          title="Error"
          description="An error occurred on Retro Ranker. Please try again later."
          robots="noindex, nofollow"
        /> */}
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
  };

  if (error instanceof HttpError) {
    const status = error.status; // HTTP status code

    if (status === 404) {
      return renderNotFound();
    }
  }

  return renderError();
}
