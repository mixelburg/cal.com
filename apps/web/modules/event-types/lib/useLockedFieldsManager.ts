// EE feature removed - field locking not available in self-hosted version
export const useLockedFieldsManager = () => ({
  isFieldLocked: () => false,
  shouldDisableField: () => false,
  getLockedFields: () => [],
});
