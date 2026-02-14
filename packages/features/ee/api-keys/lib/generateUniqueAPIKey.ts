import crypto from "crypto";

// Stub for API key generation - self-hosters can use this for basic API keys
export function generateUniqueAPIKey(): [string, string] {
  const apiKey = crypto.randomBytes(32).toString("hex");
  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  return [hashedKey, apiKey];
}
