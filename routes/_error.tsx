import { CustomFreshState } from "../interfaces/state.ts";
import { Context, HttpError, page, PageProps } from "fresh";
import { State } from "../utils.ts";

export const handler = {
  GET(ctx: Context<State>) {
    (ctx.state as CustomFreshState).seo = {
      title: "Error",
      description: "An error occurred on Retro Ranker. Please try again later.",
      robots: "noindex, nofollow",
    };
    return page(ctx);
  },
};

export default function ErrorPage(props: PageProps) {
  const _fallbackTranslations: Record<string, string> = {
    "error.404.title": "Page Not Found",
    "error.404.description": "The page you're looking for doesn't exist.",
    "error.404.suggestion": "Go back home",
    "error.general.title": "Error",
    "error.general.description": "An error occurred. Please try again later.",
    "error.general.suggestion": "Go back home",
  };
  const { error } = props;

  const renderNotFound = () => {
    return (
      <div class="not-found">
        <article>
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold">
              Page Not Found
            </h1>
            <span>
              The page you're looking for doesn't exist.
            </span>
            <h2>
              <a href="/">Go back home</a>
            </h2>
          </div>
        </article>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div class="not-found">
        {
          /* <SEO
          title="Error"
          description="An error occurred on Retro Ranker. Please try again later."
          robots="noindex, nofollow"
        /> */
        }
        <article>
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold">
              Server Error
            </h1>
            <span>
              Something went wrong on our end. Please try again later.
            </span>
            <h2>
              <a href="/">Go back home</a>
            </h2>
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
