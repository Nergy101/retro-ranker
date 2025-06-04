import { load } from "$std/dotenv/mod.ts";
import { Builder } from "fresh/dev";
import { app } from "./main.ts";

await load({ envPath: ".env", allowEmptyValues: true, export: true });

const builder = new Builder();

if (Deno.args.includes("build")) {
  await builder.build(app);
} else {
  await builder.listen(app);
}
