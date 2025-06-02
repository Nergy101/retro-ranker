#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { Builder } from "fresh/dev";
import { app } from "./main.ts";
import { load } from "$std/dotenv/mod.ts";

await load({ envPath: ".env", allowEmptyValues: true, export: true });


const builder = new Builder();
// await dev(import.meta.url, "./main.ts", config);


if (Deno.args.includes("build")) {
    await builder.build(app);
  } else {
    // ...otherwise start the development server
    await builder.listen(app);
  }