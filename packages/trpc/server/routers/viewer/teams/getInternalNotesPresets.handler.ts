import { prisma } from "@calcom/prisma";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";

import { TRPCError } from "@trpc/server";

import type { TGetInternalNotesPresetsInputSchema } from "./getInternalNotesPresets.schema";

// Stub for removed EE function
async function isTeamMember(_userId: number, _teamId: number): Promise<boolean> {
  return false;
}

type UpdateMembershipOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetInternalNotesPresetsInputSchema;
};

export const getInternalNotesPresetsHandler = async ({ ctx, input }: UpdateMembershipOptions) => {
  if (!(await isTeamMember(ctx.user?.id, input.teamId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return await prisma.internalNotePreset.findMany({
    where: {
      teamId: input.teamId,
    },
    select: {
      id: true,
      name: true,
      cancellationReason: true,
    },
  });
};

export default getInternalNotesPresetsHandler;
