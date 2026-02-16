import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";
import { MembershipRepository } from "@calcom/features/membership/repositories/MembershipRepository";
import { prisma } from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../types";
import type { TGetInputSchema } from "./get.schema";

type GetDataOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetInputSchema;
};

export const get = async ({ ctx, input }: GetDataOptions) => {
  const membershipRepository = new MembershipRepository();
  const teamMembership = await membershipRepository.findUniqueByUserIdAndTeamId({
    userId: ctx.user.id,
    teamId: input.teamId,
  });

  if (!teamMembership) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not a member of this team.",
    });
  }

  const teamRepository = new TeamRepository(prisma);
  const team = await teamRepository.findById({ id: input.teamId });

  if (!team) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Team not found",
    });
  }

  const membership = {
    role: teamMembership.role,
    accepted: teamMembership.accepted,
  };
  return { ...team, membership };
};

export default get;
