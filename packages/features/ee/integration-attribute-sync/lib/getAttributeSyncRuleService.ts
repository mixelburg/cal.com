// Stub for removed EE integration attribute sync rules - self-hosters don't have attribute sync
export function getAttributeSyncRuleService() {
  return {
    shouldSyncApplyToUser: async (_params: any) => false,
  };
}
