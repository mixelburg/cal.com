# Stub Cleanup Progress - Aggressive Removal

## 🎯 Goal
Remove ALL "// Stub for removed EE" comments and the dead code they mark.

## ✅ Progress: 79 → 66 Stub Comments (13 removed)

### Completely Deleted Files (4)
1. ❌ `publish.handler.ts` - Team publishing (unused EE feature)
2. ❌ `getAllWorkflowsFromEventType.ts` - Workflows (unused EE feature)
3. ❌ `getTeamUrlSync.ts` - Org URLs (unused)
4. ❌ `retellAIService.ts` - AI phone (unused)

### Stub Functions Inlined/Removed (8)
1. ✅ `pageWithCachedData.tsx` - Removed `getOrganizationSEOSettings()` & `orgDomainConfig()`, inlined logic
2. ✅ `slots/util.ts` - Replaced stub TeamRepository with real import
3. ✅ `handleNotificationWhenNoSlots.ts` - Replaced stub TeamRepository with real import
4. ✅ `OAuthService.ts` - Replaced stub TeamRepository with real import
5. ✅ `TeamRepository.module.ts` - Replaced stub TeamRepository with real import
6. ✅ `InsightsRoutingBaseService.ts` - Replaced stub TeamRepository with real import
7. ✅ `InsightsBookingBaseService.ts` - Replaced stub TeamRepository with real import
8. ✅ `Team.ts` (DI module) - Replaced stub TeamRepository with real import

### Critical Team Handlers Fixed (Previously - Now All Real)
✅ All 9 critical team handlers now use real TeamRepository/Prisma
- list, listOwnedTeams, get, delete, update, listMembers, getMemberAvailability, getInternalNotesPresets, acceptOrLeave

## 📊 Remaining 66 Stub Comments

### Category Breakdown:

**1. UI Components (Return Null - 11 files)**
These gracefully return null, acceptable for disabled EE features:
- Support widgets (Intercom, Helpscout, Freshchat) - 3 files
- Org/Team upgrade banners - 3 files
- Workflow/Video/Impersonation components - 3 files
- License/Settings components - 2 files

**2. EE Features/Services (30 files)**
Core EE-only functionality not needed in self-hosted:
- Workflows (WorkflowTriggerEvents, etc.) - 2 files
- SAML/SSO (saml.ts) - 1 file
- AI Phone (index.ts, promptTemplates.ts) - 2 files
- Billing/Stripe (multiple) - 5 files
- Organization services (OrganizationBillingPortalService, getBookerBaseUrl, etc.) - 5 files
- Teams services (teamService.ts, getTeamMemberEmailFromCrm.ts) - 2 files
- No-show tracking (handleMarkNoShow.ts, related) - 3 files
- API keys (list/create handlers) - 2 files
- License validation - 1 file
- Booking repository stubs - 3 files
- Other EE utilities - 4 files

**3. tRPC Routers/Handlers (18 files)**
- Team invite handlers (inviteMember/*) - 3 files
- create.handler.ts (has billing stub) - 1 file
- Routing forms reassignment endpoints - 1 file
- Organization verify code - 1 file
- Event types transform utils - 1 file
- Feature opt-in router - 1 file
- Me/updateProfile handler - 1 file
- Users router (org function stub) - 1 file
- Teams router (reassignment endpoints) - 1 file
- Logged in viewer (markNoShow, stripeCustomer) - 2 files
- Public viewer (samlTenantProduct) - 1 file
- Tasker (sendAwaitingPaymentEmail, repository) - 2 files
- Delegation credentials - 1 file
- Payment pages - 2 files

**4. Type/Schema Definitions (7 files)**
Just type stubs, minimal impact:
- eventtypes/lib/types.ts - TemplateType
- IBookingRepository.ts - WorkflowMethods
- inviteMember.schema.ts - Schema definition
- CalendarEventBuilder.ts - Workflow properties
- getBooking.ts - Workflow stubs
- routing-forms enrichment - 1 file

## 🎯 Next Steps Strategy

### Phase 1: Delete More Unused Files (High Priority)
Target files with 0-2 imports:
- `packages/features/handleMarkNoShow.ts` - 4 imports, can inline logic
- `packages/features/ee/teams/services/teamService.ts` - Delete stub service
- `packages/trpc/server/routers/viewer/teams/inviteMember/*` - Delete unused invite flow
- `packages/trpc/server/routers/viewer/organizations/verifyCode.handler.ts` - Delete
- `packages/trpc/server/routers/viewer/deploymentSetup/validateLicense.handler.ts` - Delete

### Phase 2: Inline Stub Functions (Medium Priority)
Replace stub functions with direct inline logic where called:
- `getOrgFullOrigin()` in various files - inline as empty string
- `getBookerBaseUrl()` functions - inline as empty string
- Billing service stubs - remove or inline null returns
- `isTeamOwner()` stubs - replace with direct Prisma query

### Phase 3: Clean Up UI Components (Low Priority)
These are acceptable but could be cleaner:
- Change comments from "Stub for removed EE" to "EE feature - returns null"
- Or keep as-is since they work correctly

## 📈 Impact Summary

**Files Modified**: 19
**Files Deleted**: 4
**Stub Comments Removed**: 13 (79 → 66)
**Critical Handlers Fixed**: 9 (all team CRUD operations)
**Type Errors**: 0 ✅
**Build Status**: Passing ✅

## 💡 Recommendation

Continue aggressive stub removal focusing on:
1. **Delete** truly unused files/handlers
2. **Inline** stub function logic where they're called  
3. **Replace** stub classes with real implementations
4. **Accept** null-returning UI components (correct behavior)

Target: Get to <30 stub comments (remove ~36 more)
