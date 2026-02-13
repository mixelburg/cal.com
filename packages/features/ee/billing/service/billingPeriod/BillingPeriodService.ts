// Stub for removed EE BillingPeriodService
export class BillingPeriodService {
  async getCurrentBillingPeriod(_params: any) {
    return null;
  }
  
  async getBillingPeriods(_params: any) {
    return [];
  }
  
  async getOrCreateBillingPeriodInfo(_params: any) {
    return {
      billingPeriod: null,
      isNewPeriod: false,
      billingMode: null as any,
      subscriptionStart: null as any,
      subscriptionEnd: null as any,
      pricePerSeat: 0,
    };
  }
}
