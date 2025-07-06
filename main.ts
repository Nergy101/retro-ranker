// main.ts
import { App, fsRoutes, staticFiles } from "fresh";
import { State } from "./utils.ts";
import { initializeTranslations } from "./data/frontend/services/i18n/i18n.service.ts";

export const app = new App<State>({ root: import.meta.url });

app.use(staticFiles());

// Initialize translations at startup for better performance
await initializeTranslations();

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
