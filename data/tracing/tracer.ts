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

// Standardized JSON logger for OTEL
function logJson(
  level: "info" | "warn" | "error" | "debug",
  message: string,
  data: Record<string, unknown> = {},
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };

  // Use console.log for all levels to ensure logs are always captured
  console.log(JSON.stringify(logEntry, null, 2));
}

export { logJson, tracer };
