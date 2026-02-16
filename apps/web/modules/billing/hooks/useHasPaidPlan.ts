// Self-hosted builds do not include paid-plan billing features.
export const useHasPaidPlan = () => {
  return { isLoading: false, hasPaidPlan: false };
};

export const useTeamInvites = () => {
  return { isPending: false, listInvites: [] };
};

export const useHasTeamPlan = () => {
  return { isPending: false, hasTeamPlan: false };
};

export const useHasActiveTeamPlanAsOwner = () => {
  return { hasActiveTeamPlanAsOwner: false, isLoading: false, isTrial: false };
};
