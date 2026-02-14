import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

// Stub for removed EE team publish handler - self-hosters don't have team publishing
type PublishOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: any;
};

export const publishHandler = async ({ ctx, input }: PublishOptions) => {
  throw new Error("Team publishing not supported in self-hosted version");
};
