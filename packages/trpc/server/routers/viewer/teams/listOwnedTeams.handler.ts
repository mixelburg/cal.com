import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../types";

// Stub for removed EE TeamRepository
class TeamRepository {
  constructor(_prisma: any) {}
  async findOwnedTeamsByUserId(_params: { userId: number }): Promise<any[]> {
    return [];
  }
}

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};