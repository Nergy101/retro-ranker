import { Buffer } from "node:buffer";
import { tracer, logJson } from "../tracing/tracer.ts";

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

  storeInSession(userId: string, codeVerifier: string) {
    return tracer.startActiveSpan("pkce.storeInSession", (span) => {
      span.setAttribute("user.id", userId);
      logJson('info', 'Storing codeVerifier in session', { userId });
      console.log(`[PkceSessionService] Storing codeVerifier for userId: ${userId}`);
      this.sessions.set(userId, codeVerifier);
      span.end();
    });
  }

  getFromSession(userId: string, options?: { remove?: boolean }): string | undefined {
    return tracer.startActiveSpan("pkce.getFromSession", (span) => {
      span.setAttribute("user.id", userId);
      const codeVerifier = this.sessions.get(userId);
      if (codeVerifier) {
        logJson('info', 'Retrieved codeVerifier from session', { userId });
        console.log(`[PkceSessionService] Retrieved codeVerifier for userId: ${userId}`);
      } else {
        logJson('warn', 'No codeVerifier found in session', { userId });
        console.log(`[PkceSessionService] No codeVerifier found for userId: ${userId}`);
      }
      if (options?.remove) {
        this.sessions.delete(userId);
        logJson('info', 'Removed codeVerifier from session', { userId });
        console.log(`[PkceSessionService] Removed codeVerifier for userId: ${userId}`);
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
