import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";
import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../types";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};