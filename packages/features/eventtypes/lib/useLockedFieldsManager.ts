// EE feature removed - managed event types field locking not available in self-hosted version
export function useLockedFieldsManager(..._args: any[]) {
  return {
    isManagedEventType: false,
    isChildrenManagedEventType: false,
    isUserOrganizationAdmin: false,
    shouldLockIndicator: () => false,
    shouldLockDisableProps: () => false,
    lockedFieldsManager: {
      shouldLockDisableProps: () => false,
      getLockConfig: () => ({ disabled: false, disabledReason: "" }),
    },
  };
}
