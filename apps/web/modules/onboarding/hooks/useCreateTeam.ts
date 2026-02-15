// EE feature removed - onboarding team creation not available in self-hosted version
export const useCreateTeam = () => ({
  createTeam: () => Promise.resolve(),
  isPending: false,
});
