// Stub for removed EE billing provider service - self-hosters don't have billing
export function getBillingProviderService() {
  return {
    getCustomerIdForTeam: async (_teamId: number) => null,
  };
}
