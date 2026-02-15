// Teams EE types removed
export type TeamInviteType = "member" | "admin";

export type PendingMember = {
  email: string;
  role: "MEMBER" | "ADMIN" | "OWNER";
};
