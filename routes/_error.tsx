import { FreshContext, HttpError, page, PageProps } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

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

export default function ErrorPage(props: PageProps, ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};
  const { error } = props;

  const renderNotFound = () => {
    return (
      <div class="not-found">
        <article>
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold">
              {TranslationPipe(translations, "error.404.title")}
            </h1>
            <span>
              {TranslationPipe(translations, "error.404.description")}
            </span>
            <h2>
              {TranslationPipe(translations, "error.404.suggestion")}
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
              {TranslationPipe(translations, "error.general.title")}
            </h1>
            <span>
              {TranslationPipe(translations, "error.general.description")}
            </span>
            <h2>{TranslationPipe(translations, "error.general.suggestion")}</h2>
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
