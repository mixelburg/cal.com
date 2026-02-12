import prisma from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../types";
import type { TGetListSchema } from "./list.schema";

// Stub for removed EE TeamRepository
class TeamRepository {
  constructor(_prisma: any) {}
  async findTeamsByUserId(_params: { userId: number; includeOrgs?: boolean }): Promise<any[]> {
    return [];
  }
}

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetListSchema;
};

export const listHandler = async ({ ctx, input }: ListOptions) => {
  const teamRepo = new TeamRepository(prisma);
  return teamRepo.findTeamsByUserId({
    userId: ctx.user.id,
    includeOrgs: input?.includeOrgs,
  });
};

export default listHandler;
