// Stub for removed EE team invite utils - self-hosters have basic team invites
export async function checkPermissions(_params: any) {
  return false;
}

export async function createInvitation(_params: any) {
  throw new Error("Team invitations not supported via this method in self-hosted version");
}
