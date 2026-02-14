import type { TInviteMemberInputSchema } from "./inviteMember.schema";

// Stub for removed EE team invite handler - self-hosters have teams but not this specific invite flow
type InviteMemberOptions = {
  ctx: {
    user: any;
  };
  input: TInviteMemberInputSchema;
};

export const inviteMemberHandler = async ({ ctx, input }: InviteMemberOptions) => {
  throw new Error("Team member invitations not supported in self-hosted version");
};
