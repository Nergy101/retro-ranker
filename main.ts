/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";

slugify.extend({
  "?": "question-mark",
});

await start(manifest, config);
