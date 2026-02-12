import prisma from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../types";
import type { ZDeleteInputSchema } from "./delete.schema";

type Options = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZDeleteInputSchema;
};

// Delete directory sync connection for a team
export const deleteHandler = async ({ ctx, input }: Options) => {
  const { dsyncController } = await jackson();

  const { message, access } = await canAccessOrganization(ctx.user, input.organizationId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  await prisma.dSyncData.deleteMany({
    where: {
      organizationId: input.organizationId || undefined,
    },
  });
  await dsyncController.directories.delete(input.directoryId);

  return null;
};

export default deleteHandler;
