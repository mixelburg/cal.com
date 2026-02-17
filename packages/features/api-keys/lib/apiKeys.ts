import { randomBytes, createHash } from "node:crypto";

// Hash the API key so we never store plain API keys in DB.
export const hashAPIKey = (apiKey: string): string => createHash("sha256").update(apiKey).digest("hex");

// Prisma ensures uniqueness for hashed keys, so random bytes are sufficient.
export const generateUniqueAPIKey = (apiKey = randomBytes(16).toString("hex")) => [
  hashAPIKey(apiKey),
  apiKey,
];
