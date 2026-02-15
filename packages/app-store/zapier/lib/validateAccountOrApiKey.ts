import type { NextApiRequest } from "next";

import isAuthorized from "@calcom/features/auth/lib/oAuthAuthorization";
import { HttpError } from "@calcom/lib/http-error";

// API keys removed (EE feature) - stub function with full ApiKey type
type ApiKey = {
  id: string;
  userId: number;
  teamId: number | null;
  createdAt: Date;
  appId: string | null;
  lastUsedAt: Date | null;
  note: string | null;
  expiresAt: Date | null;
  hashedKey: string;
};
async function findValidApiKey(_apiKey: string, _appId?: string): Promise<ApiKey | null> {
  return null;
}

export async function validateAccountOrApiKey(req: NextApiRequest, requiredScopes: string[] = []) {
  const apiKey = req.query.apiKey as string;

  if (!apiKey) {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const authorizedAccount = await isAuthorized(token, requiredScopes);
    if (!authorizedAccount) throw new HttpError({ statusCode: 401, message: "Unauthorized" });
    return { account: authorizedAccount, appApiKey: undefined };
  }

  const validKey = await findValidApiKey(apiKey, "zapier");
  if (!validKey) throw new HttpError({ statusCode: 401, message: "API key not valid" });
  return { account: null, appApiKey: validKey };
}
