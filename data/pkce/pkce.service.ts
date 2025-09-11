import { Buffer } from "node:buffer";

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
    console.log("Storing codeVerifier in session", { stateId });
    this.sessions.set(stateId, codeVerifier);
  }

  getFromSession(
    stateId: string,
    options?: { remove?: boolean },
  ): string | undefined {
    const codeVerifier = this.sessions.get(stateId);
    if (codeVerifier) {
      console.log("Retrieved codeVerifier from session", {
        stateId,
        codeVerifier,
      });
    } else {
      console.warn("No codeVerifier found in session", { stateId });
    }
    if (options?.remove) {
      this.sessions.delete(stateId);
      console.log("Removed codeVerifier from session", { stateId });
    }
    return codeVerifier;
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
