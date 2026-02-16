// EE feature removed - field locking not available in self-hosted version
export const useLockedFieldsManager = (..._args: any[]) => ({
  isManagedEventType: false,
  isChildrenManagedEventType: false,
  isUserOrganizationAdmin: false,
  shouldLockIndicator: () => false,
  shouldLockDisableProps: () => false,
  lockedFieldsManager: {
    shouldLockDisableProps: () => false,
    getLockConfig: () => ({ disabled: false, disabledReason: "" }),
  },
  isFieldLocked: () => false,
  shouldDisableField: () => false,
  getLockedFields: () => [],
});
