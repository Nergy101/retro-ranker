// main.ts
import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";

export const app = new App()
  // Add static file serving middleware
  .use(staticFiles())
  .use(trailingSlashes("always"));

// Enable file-system based routing
// can be nested
await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

// If this module is called directly, start the server
if (import.meta.main) {
  await app.listen();
}
