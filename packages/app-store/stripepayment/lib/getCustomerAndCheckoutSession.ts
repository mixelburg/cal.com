// EE billing removed - stub functions with full types
type StripeCustomer = {
  id: string;
  email: string;
  deleted?: boolean;
  metadata: { username?: string };
};
type CheckoutSession = {
  customer: string | null;
  payment_status: string;
};
function getBillingProviderService() {
  return {
    getCheckoutSession: async (_id: string): Promise<CheckoutSession> => ({
      customer: null,
      payment_status: "unpaid",
    }),
    getCustomer: async (_id: string): Promise<StripeCustomer | null> => null,
  };
}
async function getBookerBaseUrl(_orgId: number | null): Promise<string> {
  return "";
}

export async function getCustomerAndCheckoutSession(checkoutSessionId: string) {
  const billingService = getBillingProviderService();
  const checkoutSession = await billingService.getCheckoutSession(checkoutSessionId);
  const customerOrCustomerId = checkoutSession.customer;
  let customerId = null;

  if (!customerOrCustomerId) {
    return { checkoutSession, stripeCustomer: null };
  }

  if (typeof customerOrCustomerId === "string") {
    customerId = customerOrCustomerId;
  } else if (customerOrCustomerId.deleted) {
    return { checkoutSession, stripeCustomer: null };
  } else {
    customerId = customerOrCustomerId.id;
  }
  const stripeCustomer = await billingService.getCustomer(customerId);
  if (stripeCustomer.deleted) {
    return { checkoutSession, stripeCustomer: null };
  }
  return { stripeCustomer, checkoutSession };
}
