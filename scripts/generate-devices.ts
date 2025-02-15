// call ../data/source/data-source.ts
const command = new Deno.Command("deno", {
  args: ["run", "--allow-all", "data-source.ts"],
  cwd: "../data/source",
});

const process = command.spawn();
await process.status;
