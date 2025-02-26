const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "device.patcher.ts"],
    cwd: "../data/source/device-patcher",
  });
  
  const process = command.spawn();
  await process.status;
  