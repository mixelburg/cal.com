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
import { WebhookTriggerEvents } from "@calcom/features/webhooks/lib/WebhookTriggerEvents";
import prisma from "@calcom/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.query.apiKey as string;

  if (!apiKey) {
    return res.status(401).json({ message: "No API key provided" });
  }

  const validKey = await findValidApiKey(apiKey, "make");

  if (!validKey) {
    return res.status(401).json({ message: "API key not valid" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: validKey.userId,
        },
        select: {
          username: true,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to get User." });
    }
  }
}
