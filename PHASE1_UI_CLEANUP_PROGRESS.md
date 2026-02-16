# Phase 1: UI Component Stub Cleanup

## 🎯 Goal
Remove all UI component stubs that return null and their usage throughout the codebase.

## 📋 Components to Remove

### 1. Video EE Features
- ❌ `ViewRecordingsDialog` - apps/web/modules/ee/video/components/ViewRecordingsDialog.tsx
- ❌ `MeetingSessionDetailsDialog` - apps/web/modules/ee/video/components/MeetingSessionDetailsDialog.tsx

**Used in:**
- `apps/web/components/booking/actions/BookingActionsDropdown.tsx`
- `apps/web/components/booking/actions/store.ts`

### 2. Reassignment EE Feature
- ❌ `ReassignDialog` - apps/web/components/dialog/ReassignDialog.tsx (422 lines!)

**Used in:**
- `apps/web/components/booking/actions/BookingActionsDropdown.tsx`
- `apps/web/components/booking/actions/store.ts`

**Also remove 6 tRPC endpoints:**
- `getManagedEventUsersToReassign`
- `getRoundRobinHostsToReassign`  
- `roundRobinReassign`
- `managedEventReassign`
- `roundRobinManualReassign`
- `managedEventManualReassign`

### 3. Other Stub UI Components
- ❌ `TeamsUpgradeBanner` - apps/web/modules/ee/teams/components/TeamsUpgradeBanner.tsx
- ❌ `SkeletonLoaderTeamList` - apps/web/modules/ee/teams/components/SkeletonloaderTeamList.tsx  
- ❌ `IntercomProvider` - apps/web/modules/ee/support/lib/intercom/providerDynamic.tsx
- ❌ `HelpscoutProvider` - apps/web/modules/ee/support/lib/helpscout/providerDynamic.tsx
- ❌ `FreshChatProvider` - apps/web/modules/ee/support/lib/freshchat/FreshChatProvider.tsx
- ❌ `WelcomeToOrganizationsModal` - apps/web/modules/ee/organizations/components/WelcomeToOrganizationsModal.tsx
- ❌ `OrgUpgradeBanner` - apps/web/modules/ee/organizations/components/OrgUpgradeBanner.tsx
- ❌ `ImpersonatingBanner` - apps/web/modules/ee/impersonation/components/ImpersonatingBanner.tsx
- ❌ `LicenseRequired` - apps/web/modules/ee/common/components/LicenseRequired.tsx
- ❌ `CallDetailsSheet` - apps/web/modules/ee/workflows/components/CallDetailsSheet.tsx

## 🚀 Execution Status

### Step 1: Remove Video Dialog Usage ⏳
- [ ] Remove imports from BookingActionsDropdown.tsx
- [ ] Remove state from store.ts
- [ ] Remove dialog usage in BookingActionsDropdown.tsx
- [ ] Remove action triggers ("view_recordings", "meeting_session_details")
- [ ] Delete stub component files

### Step 2: Remove Reassignment Feature ⏳
- [ ] Remove ReassignDialog import from BookingActionsDropdown.tsx
- [ ] Remove isOpenReassignDialog state from store.ts
- [ ] Remove ReassignDialog usage
- [ ] Remove "reassign" action trigger
- [ ] Delete ReassignDialog.tsx file (422 lines)
- [ ] Remove 6 tRPC stub endpoints from teams/_router.tsx

### Step 3: Clean Up Other Stub Components ⏳
- [ ] Find and remove usage of each component
- [ ] Delete stub files

## 📊 Expected Impact
- **Files deleted**: ~16 stub component files
- **Lines removed**: ~700+ lines (inc. ReassignDialog 422 lines)
- **Broken UI elements removed**: All buttons/dialogs that don't work
