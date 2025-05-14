import { Buffer } from "node:buffer";
import { logJson, tracer } from "../tracing/tracer.ts";

class PkceSessionService {
  private static instance: PkceSessionService;
  private sessions = new Map<string, string>();

  private constructor() {}

  static getInstance(): PkceSessionService {
    if (!PkceSessionService.instance) {
      PkceSessionService.instance = new PkceSessionService();
    }
    return PkceSessionService.instance;
  }

  storeInSession(stateId: string, codeVerifier: string) {
    return tracer.startActiveSpan("pkce.storeInSession", (span) => {
      span.setAttribute("state.id", stateId);
      logJson("info", "Storing codeVerifier in session", { stateId });
      this.sessions.set(stateId, codeVerifier);
      span.end();
    });
  }

  getFromSession(
    stateId: string,
    options?: { remove?: boolean },
  ): string | undefined {
    return tracer.startActiveSpan("pkce.getFromSession", (span) => {
      span.setAttribute("state.id", stateId);
      const codeVerifier = this.sessions.get(stateId);
      if (codeVerifier) {
        logJson("info", "Retrieved codeVerifier from session", {
          stateId,
          codeVerifier,
        });
      } else {
        logJson("warn", "No codeVerifier found in session", { stateId });
      }
      if (options?.remove) {
        this.sessions.delete(stateId);
        logJson("info", "Removed codeVerifier from session", { stateId });
      }
      span.setAttribute("pkce.codeVerifier.found", !!codeVerifier);
      span.setAttribute("pkce.codeVerifier.removed", !!options?.remove);
      span.end();
      return codeVerifier;
    });
  }
}

export default PkceSessionService.getInstance();

// pkce.ts
function base64urlEncode(str: ArrayBuffer): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return base64urlEncode(randomBytes.buffer);
}

export async function generateCodeChallenge(
  codeVerifier: string,
): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  return base64urlEncode(digest);
}
