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

export const listOwnedTeamsHandler = async ({ ctx }: ListOptions) => {
  const teamRepository = new TeamRepository(prisma);
  return await teamRepository.findOwnedTeamsByUserId({ userId: ctx.user.id });
};
