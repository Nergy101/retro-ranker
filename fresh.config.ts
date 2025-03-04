import { defineConfig } from "$fresh/server.ts";
import { slugify } from "https://deno.land/x/slugify@0.3.0/mod.ts";

slugify.extend({
  "?": "question-mark",
});


export default defineConfig({});
