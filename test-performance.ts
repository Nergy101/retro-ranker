#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

console.log("🚀 Starting Retro Ranker with Performance Logging...");
console.log("📊 Performance logs will be displayed below:");
console.log("=".repeat(60));

// Set environment variables for testing
Deno.env.set("POCKETBASE_URL", "https://pocketbase.retroranker.site");
Deno.env.set("POCKETBASE_SUPERUSER_EMAIL", "your-email@example.com");
Deno.env.set("POCKETBASE_SUPERUSER_PASSWORD", "your-password");
Deno.env.set("BASE_URL", "http://localhost:8000");

// Start the development server
const cmd = new Deno.Command("deno", {
  args: ["run", "-A", "--watch", "dev.ts"],
  cwd: Deno.cwd(),
  stdout: "piped",
  stderr: "piped",
});

const child = cmd.spawn();

// Monitor output for performance logs
const reader = child.stdout.getReader();
const decoder = new TextDecoder();

console.log("🔍 Monitoring for performance logs...\n");

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const output = decoder.decode(value);
    const lines = output.split("\n");

    for (const line of lines) {
      if (line.includes('"level":"info"') && line.includes("Time")) {
        // Highlight performance-related logs
        console.log(`⏱️  ${line}`);
      } else if (line.includes('"level":"error"')) {
        // Highlight errors
        console.log(`❌ ${line}`);
      } else if (line.includes('"level":"warn"')) {
        // Highlight warnings
        console.log(`⚠️  ${line}`);
      } else if (line.includes("Fresh is ready")) {
        // Highlight server ready
        console.log(`✅ ${line}`);
      }
    }
  }
} catch (error) {
  console.error("Error reading output:", error);
} finally {
  reader.releaseLock();
  child.kill();
}

console.log("\n🏁 Performance monitoring stopped.");
