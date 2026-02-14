// Stub for removed EE integration attribute sync - self-hosters don't have attribute sync
export function getIntegrationAttributeSyncService() {
  return {
    getAllByCredentialId: async (_credentialId: number): Promise<any[]> => [],
  };
}
