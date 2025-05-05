// deno-lint-ignore-file no-explicit-any
import { trace } from "npm:@opentelemetry/api@1";

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

export { tracer };
