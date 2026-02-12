import { prisma } from "@calcom/prisma";
import { userMetadata } from "@calcom/prisma/zod-utils";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";

import { TRPCError } from "@trpc/server";

// Stub for removed EE billing service - returns null to skip billing logic
const getBillingProviderService = () => null;

type StripeCustomerOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const stripeCustomerHandler = async ({ ctx }: StripeCustomerOptions) => {
  // Billing service disabled (EE-only)
  return { isPremium: false, username: null };
};
