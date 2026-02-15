import type { NextApiRequest, NextApiResponse } from "next";

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
import { listBookings } from "@calcom/features/webhooks/lib/scheduleTrigger";
import { WebhookTriggerEvents } from "@calcom/features/webhooks/lib/WebhookTriggerEvents";
import { defaultHandler } from "@calcom/lib/server/defaultHandler";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.query.apiKey as string;

  if (!apiKey) {
    return res.status(401).json({ message: "No API key provided" });
  }

  const validKey = await findValidApiKey(apiKey, "make");

  if (!validKey) {
    return res.status(401).json({ message: "API key not valid" });
  }
  const bookings = await listBookings(validKey);

  if (!bookings) {
    return res.status(500).json({ message: "Unable to get bookings." });
  }
  if (bookings.length === 0) {
    const requested = validKey.teamId ? `teamId: ${validKey.teamId}` : `userId: ${validKey.userId}`;
    return res.status(404).json({
      message: `There are no bookings to retrieve, please create a booking first. Requested: \`${requested}\``,
    });
  }
  res.status(201).json(bookings);
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(handler) }),
});
