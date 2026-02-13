// Stub for removed EE ActiveUserBillingService
export function getActiveUserBillingService() {
  return {
    getActiveUsers: async (_params: any) => [],
    getActiveUserCount: async (_params: any) => 0,
    getBookingsForUser: async (_userId: any, _teamId: any, _billingPeriodStartDate: any, _billingPeriodEndDate: any, _timezone: any) => [],
    getActiveUsersForOrg: async (_orgId: any, _billingPeriodId: any, _timezone: any) => ({
      activeUsers: 0,
      totalMembers: 0,
      activeHosts: 0,
      activeAttendees: 0,
    }),
  };
}
