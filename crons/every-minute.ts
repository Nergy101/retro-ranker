Deno.cron("sample cron", "* * * * *", () => {
  console.log("cron job executed every minute");
});
