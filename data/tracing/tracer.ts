// deno-lint-ignore-file no-explicit-any no-console
import { trace } from "@opentelemetry/api";

// Create a tracer with service name
const tracer = trace.getTracer("retro-ranker", "1.0.0");

// Set the service name in the tracer's resource
tracer.startSpan = function (name: string, options?: any) {
  const span = trace.getTracer("retro-ranker", "1.0.0").startSpan(
    name,
    options,
  );
  span.setAttribute("service.name", "retro-ranker");
  return span;
};

// Log level priority (higher number = more severe)
const LOG_LEVELS: Record<string, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get configured log level (defaults to "none" which disables all logging)
function getConfiguredLogLevel(): number {
  const level = Deno.env.get("LOG_LEVEL")?.toLowerCase();
  if (!level || level === "none") {
    return Infinity; // No logging
  }
  return LOG_LEVELS[level] ?? Infinity;
}

// Standardized JSON logger for OTEL
function logJson(
  level: "info" | "warn" | "error" | "debug",
  message: string,
  data: Record<string, unknown> = {},
) {
  const configuredLevel = getConfiguredLogLevel();
  const messageLevel = LOG_LEVELS[level];

  // Only log if message level >= configured level
  if (messageLevel < configuredLevel) {
    return;
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };

  console.log(JSON.stringify(logEntry, null, 2));
}

export { logJson, tracer };
