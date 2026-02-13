// Stub for removed EE BillingPeriodService
export class BillingPeriodService {
  async getCurrentBillingPeriod(_params: any) {
    return null;
  }
  
  async getBillingPeriods(_params: any) {
    return [];
  }
  
  async getOrCreateBillingPeriodInfo(_params: any) {
    return { billingPeriod: null, isNewPeriod: false };
  }
}
