# Stub Audit Plan - Determine What Can Be Removed

## 🎯 Goal
For each "// Stub for" comment, determine:
1. **Can we delete the calling code?** (Better - no broken UI)
2. **Must we keep the stub?** (Necessary for type safety/compilation)

## 📊 Stub Categories

### Category 1: **UI Components** (Can likely DELETE entirely)
**Pattern**: React components that return `null` - UI for disabled EE features

| File | Stub | Used By | Action |
|------|------|---------|--------|
| `apps/web/modules/ee/workflows/components/CallDetailsSheet.tsx` | `CallDetailsSheet` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/video/components/ViewRecordingsDialog.tsx` | `ViewRecordingsDialog` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/video/components/MeetingSessionDetailsDialog.tsx` | `MeetingSessionDetailsDialog` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/teams/components/TeamsUpgradeBanner.tsx` | `TeamsUpgradeBanner` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/teams/components/SkeletonloaderTeamList.tsx` | `SkeletonLoaderTeamList` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/support/lib/intercom/providerDynamic.tsx` | `IntercomProvider` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/support/lib/helpscout/providerDynamic.tsx` | `HelpscoutProvider` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/support/lib/freshchat/FreshChatProvider.tsx` | `FreshChatProvider` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/organizations/components/WelcomeToOrganizationsModal.tsx` | `WelcomeToOrganizationsModal` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/organizations/components/OrgUpgradeBanner.tsx` | `OrgUpgradeBanner` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/impersonation/components/ImpersonatingBanner.tsx` | `ImpersonatingBanner` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/ee/common/components/LicenseRequired.tsx` | `LicenseRequired` | Check imports | ❓ Find & remove imports |
| `apps/web/modules/billing/hooks/useHasPaidPlan.ts` | `useHasPaidPlan()` | Check imports | ❓ Find & remove imports |

### Category 2: **tRPC Endpoints** (UI depends on these - DELETE UI + stubs)
**Pattern**: tRPC endpoints that return empty/stub data - UI calls them but gets no real data

| File | Stub Endpoints | Used By UI | Action |
|------|----------------|------------|--------|
| `packages/trpc/server/routers/viewer/teams/_router.tsx` | `getManagedEventUsersToReassign`, `getRoundRobinHostsToReassign`, `roundRobinReassign`, `managedEventReassign`, `roundRobinManualReassign`, `managedEventManualReassign` | `apps/web/components/dialog/ReassignDialog.tsx` | ❌ **DELETE** `ReassignDialog` + all 6 stub endpoints |
| `packages/trpc/server/routers/viewer/routing-forms/_router.ts` | `findTeamMembersMatchingAttributeLogicOfRoute` | Check UI usage | ❓ Find UI, decide |
| `packages/trpc/server/routers/loggedInViewer/_router.tsx` | `markNoShow` | Check UI usage | ❓ Find UI, decide |
| `packages/trpc/server/routers/publicViewer/samlTenantProduct.handler.ts` | `samlTenantProduct` | Check UI usage | ❓ Find UI, decide |

### Category 3: **Helper Functions** (MUST KEEP - needed for type safety)
**Pattern**: Functions returning empty/default values - code depends on them existing

| File | Stub Function | Why Needed | Action |
|------|---------------|------------|--------|
| `packages/features/eventtypes/lib/getEventTypesByViewer.ts` | `getBookerBaseUrl()` | Org feature - many files call it | ✅ **KEEP** - would break 10+ files |
| `packages/features/CalendarEventBuilder.ts` | `getBookerBaseUrl()` | Org feature - calendar building | ✅ **KEEP** |
| `packages/features/bookings/lib/payment/getBooking.ts` | `getBookerBaseUrl()` | Org feature - payment flow | ✅ **KEEP** |
| `packages/features/bookings/lib/handleNewBooking/loadUsers.ts` | `getOrgDomainConfig()` | Org feature - user loading | ✅ **KEEP** |
| `apps/web/lib/getOrgFullOrigin.ts` | `getOrgFullOrigin()` | Org feature - many imports | ✅ **KEEP** |
| `app-store/routing-forms/enrichFormWithMigrationData.ts` | `getOrgFullOrigin()` | Org feature - routing forms | ✅ **KEEP** |
| `packages/features/webhooks/lib/WebhookTriggerEvents.ts` | `WebhookTriggerEvents` enum | Type safety - widely used | ✅ **KEEP** |
| `packages/features/bookings/lib/tasker/BookingEmailAndSmsTaskService.ts` | `getAllWorkflowsFromEventType()` | Workflows removed - booking flow | ✅ **KEEP** |
| `packages/features/bookings/repositories/BookingRepository.ts` | `workflowSelect` | Workflows removed - query select | ✅ **KEEP** |
| `packages/features/bookings/lib/payment/getBooking.ts` | `workflowSelect` | Workflows removed - query select | ✅ **KEEP** |
| `packages/features/bookings/lib/handleNewBooking/getEventTypesFromDB.ts` | `workflowSelect` | Workflows removed - query select | ✅ **KEEP** |
| `packages/features/bookings/lib/getBookingToDelete.ts` | `workflowSelect` | Workflows removed - query select | ✅ **KEEP** |

### Category 4: **Service/Repository Stubs** (Check if used, likely KEEP)
**Pattern**: Class/object stubs for removed services

| File | Stub | Used By | Action |
|------|------|---------|--------|
| `packages/trpc/server/routers/viewer/me/updateProfile.handler.ts` | `billingService` object | Profile update handler | ❓ Check if actually called |
| `packages/trpc/server/routers/viewer/featureOptIn/_router.ts` | `teamRepository` | Feature opt-in | ❓ Check if actually used |
| `packages/trpc/server/routers/viewer/apiKeys/list.handler.ts` | `PrismaApiKeyRepository` class | API keys list | ❓ Check if used |
| `packages/trpc/server/routers/viewer/apiKeys/create.handler.ts` | `generateUniqueAPIKey()` | API keys create | ❓ Check if used |
| `packages/trpc/server/routers/loggedInViewer/stripeCustomer.handler.ts` | `getBillingProviderService()` | Stripe customer | ❓ Check if used |
| `packages/features/tasker/tasks/sendAwaitingPaymentEmail.ts` | `stripe` object | Payment emails | ❓ Check if used |
| `packages/features/tasker/repository.ts` | `scanWorkflowBodySchema` | Tasker workflow scan | ❓ Check if used |
| `packages/features/pbac/services/legacy-role-manager.service.ts` | `isTeamOwner()` | Permission checks | ❓ Check if used |
| `packages/features/bookings/lib/payment/handleNoShowFee.ts` | `TeamRepository` class | No-show fee handling | ❓ Check if used |
| `packages/features/delegation-credentials/repositories/DelegationCredentialRepository.ts` | `getOrganizationRepository()` | Credential delegation | ❓ Check if used |

### Category 5: **Type Stubs** (MUST KEEP - type safety)
**Pattern**: Type definitions for removed features

| File | Stub Type | Why Needed | Action |
|------|-----------|------------|--------|
| `apps/web/components/team/screens/Team.tsx` | `TeamWithMembers` type | Team component types | ✅ **KEEP** |
| `apps/web/app/(use-page-wrapper)/settings/(settings-layout)/SettingsLayoutAppDirClient.tsx` | `OrganizationBranding` type | Settings layout types | ✅ **KEEP** |
| `packages/features/eventtypes/lib/types.ts` | `TemplateType` | Event type types | ✅ **KEEP** |
| `packages/features/bookings/repositories/IBookingRepository.ts` | `WorkflowMethods` type | Booking repo interface | ✅ **KEEP** |

## 🎬 Action Plan

### Phase 1: DELETE UI Components (Biggest Impact)
1. Find all imports of stub UI components
2. Remove import statements
3. Remove component usage in JSX
4. Delete stub component files
5. Test build

### Phase 2: DELETE tRPC Endpoints + UI
1. **ReassignDialog**: Remove entire dialog + 6 stub endpoints
2. Check other tRPC stubs for UI usage
3. Remove UI + endpoints together
4. Test build

### Phase 3: KEEP Helper Functions (Document Why)
1. Add better comments explaining why each stub is needed
2. Change `// Stub for removed EE...` to `// EE feature removed - returns default value for X`

### Phase 4: Audit Service Stubs (Case-by-case)
1. For each service stub, check if it's actually called
2. If not called, remove it
3. If called, keep with better comment

## 🎯 Success Criteria
- ❌ No broken UI elements that appear functional but don't work
- ✅ Clear comments on why each remaining stub exists
- ✅ Type-safe compilation
- ✅ No unused stubs
