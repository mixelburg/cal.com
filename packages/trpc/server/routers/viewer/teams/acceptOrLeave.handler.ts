import { prisma } from "@calcom/prisma";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";

import type { TAcceptOrLeaveInputSchema } from "./acceptOrLeave.schema";

type AcceptOrLeaveOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAcceptOrLeaveInputSchema;
};

export const acceptOrLeaveHandler = async ({ ctx, input }: AcceptOrLeaveOptions) => {
  if (input.accept) {
    // Accept team membership
    await prisma.membership.update({
      where: {
        userId_teamId: {
          userId: ctx.user.id,
          teamId: input.teamId,
        },
      },
      data: {
        accepted: true,
      },
    });
  } else {
    // Leave team - delete membership
    await prisma.membership.delete({
      where: {
        userId_teamId: {
          userId: ctx.user.id,
          teamId: input.teamId,
        },
      },
    });
  }
};

export default acceptOrLeaveHandler;
