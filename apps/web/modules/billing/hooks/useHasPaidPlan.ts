// Stub for removed EE billing hook - self-hosters don't have paid plans
export const useHasPaidPlan = () => {
  return { isLoading: false, hasPaidPlan: false };
};
