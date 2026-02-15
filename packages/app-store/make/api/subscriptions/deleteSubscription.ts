import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

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
import { deleteSubscription } from "@calcom/features/webhooks/lib/scheduleTrigger";
import { WebhookTriggerEvents } from "@calcom/features/webhooks/lib/WebhookTriggerEvents";
import { defaultHandler } from "@calcom/lib/server/defaultHandler";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";

const querySchema = z.object({
  apiKey: z.string(),
  id: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { apiKey, id } = querySchema.parse(req.query);

  if (!apiKey) {
    return res.status(401).json({ message: "No API key provided" });
  }

  const validKey = await findValidApiKey(apiKey, "make");

  if (!validKey) {
    return res.status(401).json({ message: "API key not valid" });
  }

  const deleteEventSubscription = await deleteSubscription({
    appApiKey: validKey,
    webhookId: id,
    appId: "make",
  });

  if (!deleteEventSubscription) {
    return res.status(500).json({ message: "Could not delete subscription." });
  }
  res.status(204).json({ message: "Subscription is deleted." });
}

export default defaultHandler({
  DELETE: Promise.resolve({ default: defaultResponder(handler) }),
});
