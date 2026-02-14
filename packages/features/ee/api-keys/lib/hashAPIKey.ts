import crypto from "crypto";

// Stub for API key hashing - self-hosters can use this for basic API key support
export function hashAPIKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}
