import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { load } from "@std/dotenv";

// Load environment variables
await load({ envPath: ".env", export: true });

export const app = new App<State>();

app.use(staticFiles())
  .fsRoutes();

// Export the app for Fresh 2
export default app;
