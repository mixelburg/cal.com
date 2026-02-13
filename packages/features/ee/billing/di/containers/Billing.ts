// Stub for removed EE billing service
export function getBillingProviderService() {
  return {
    createCustomer: async (_params: any) => ({ id: null }),
    createSubscriptionCheckout: async (_params: any) => ({ url: null }),
  };
}
