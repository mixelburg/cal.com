import { z } from "zod";

// Stub for removed EE team invite schema
export const ZInviteMemberInputSchema = z.object({
  teamId: z.number(),
  usernameOrEmail: z.string(),
  role: z.enum(["MEMBER", "ADMIN", "OWNER"]),
  sendEmailInvitation: z.boolean().optional(),
  language: z.string().optional(),
});

export type TInviteMemberInputSchema = z.infer<typeof ZInviteMemberInputSchema>;
