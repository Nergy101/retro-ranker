// main.ts
import { App, fsRoutes, staticFiles } from "fresh";
import { State } from "./utils.ts";

export const app = new App<State>({ root: import.meta.url });

app.use(staticFiles());

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
