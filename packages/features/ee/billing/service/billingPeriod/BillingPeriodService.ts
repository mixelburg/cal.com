// Stub for removed EE BillingPeriodService
export class BillingPeriodService {
  static async getCurrentBillingPeriod(_params: any) {
    return null;
  }
  
  static async getBillingPeriods(_params: any) {
    return [];
  }
  
  static async getOrCreateBillingPeriodInfo(_params: any) {
    return { billingPeriod: null, isNewPeriod: false };
  }
}
