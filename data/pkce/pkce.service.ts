import { Buffer } from "node:buffer";

interface SessionData {
  codeVerifier: string;
  redirectUri?: string;
}

class PkceSessionService {
  private static instance: PkceSessionService;
  private sessions = new Map<string, SessionData>();

  private constructor() {}

  static getInstance(): PkceSessionService {
    if (!PkceSessionService.instance) {
      PkceSessionService.instance = new PkceSessionService();
    }
    return PkceSessionService.instance;
  }

  storeInSession(stateId: string, codeVerifier: string, redirectUri?: string) {
    this.sessions.set(stateId, { codeVerifier, redirectUri });
  }

  getFromSession(
    stateId: string,
    options?: { remove?: boolean },
  ): string | undefined {
    const sessionData = this.sessions.get(stateId);
    if (!sessionData) {
      console.warn(`No session data found for state ${stateId}`);
      return undefined;
    }
    const codeVerifier = sessionData.codeVerifier;
    if (codeVerifier) {
      console.log(`Code verifier found in session ${stateId}`);
    }
    if (options?.remove) {
      this.sessions.delete(stateId);
    }
    return codeVerifier;
  }

  getRedirectUri(
    stateId: string,
    options?: { remove?: boolean },
  ): string | undefined {
    const sessionData = this.sessions.get(stateId);
    if (!sessionData) {
      return undefined;
    }
    const redirectUri = sessionData.redirectUri;
    if (options?.remove) {
      this.sessions.delete(stateId);
    }
    return redirectUri;
  }

  getSessionData(
    stateId: string,
    options?: { remove?: boolean },
  ): SessionData | undefined {
    const sessionData = this.sessions.get(stateId);
    if (options?.remove && sessionData) {
      this.sessions.delete(stateId);
    }
    return sessionData;
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
