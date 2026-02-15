// EE feature removed - onboarding team creation not available in self-hosted version
export const useCreateTeam = () => ({
  createTeam: (..._args: any[]) => Promise.resolve(),
  isPending: false,
  isSubmitting: false,
  inviteMembers: (..._args: any[]) => Promise.resolve(),
});
