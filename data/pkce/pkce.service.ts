import { Buffer } from "node:buffer";

class PkceSessionService {
  private sessions = new Map<string, string>();

  storeInSession(userId: string, codeVerifier: string) {
    this.sessions.set(userId, codeVerifier);
  }

  getFromSession(userId: string, options?: { remove?: boolean }): string | undefined {
    const codeVerifier = this.sessions.get(userId);
    if (options?.remove) {
      this.sessions.delete(userId);
    }
    return codeVerifier;
  }
}

const pkceSessionService = new PkceSessionService();
export default pkceSessionService;

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
