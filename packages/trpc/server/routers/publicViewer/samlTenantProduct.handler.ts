import type { PrismaClient } from "@calcom/prisma";

import type { TSamlTenantProductInputSchema } from "./samlTenantProduct.schema";

type SamlTenantProductOptions = {
  ctx: {
    prisma: PrismaClient;
  };
  input: TSamlTenantProductInputSchema;
};

export const samlTenantProductHandler = ({ ctx, input }: SamlTenantProductOptions) => {
  const { prisma } = ctx;
  const { email } = input;

  // EE SSO tenant-product lookup is intentionally unavailable in self-hosted builds.
  return null;
};

export default samlTenantProductHandler;
