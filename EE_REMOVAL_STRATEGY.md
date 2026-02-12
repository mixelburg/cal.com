# Enterprise Edition (/ee) Removal Strategy

## Overview

This document outlines the strategy for removing all Enterprise Edition code from the Cal.com codebase to create the open-source `cal.diy` version.

## Scope

### Directories to Remove
1. **packages/features/ee/** (2.8MB, ~400+ files) - Backend services, repositories, business logic
2. **apps/web/modules/ee/** (1.3MB, ~200+ files) - Frontend UI components, views, hooks
3. **apps/api/v2/src/ee/** (1.9MB, ~100+ files) - API v2 enterprise endpoints
4. **packages/ee/** (small) - Shared enterprise utilities (DI, Prisma extensions)

Total: **~738 TypeScript files** to remove

### Enterprise Features Being Removed

#### Billing & Payments
- `CreditService` - Credit-based billing
- `StripeBillingService` - Stripe integration for team billing
- `TeamBillingService` - Team subscription management
- `SeatChangeTrackingService` - Track seat changes for billing
- `DueInvoiceService` - Invoice management

#### Workflows
- `WorkflowService` - Automated workflows (email/SMS reminders)
- `EmailWorkflowService` - Email workflow management
- `workflowSelect`, `getAllWorkflowsFromEventType` - Workflow queries
- Workflow repositories and types

#### Organizations
- `AdminOrganizationUpdateService` - Org admin operations
- `OrganizationMembershipService` - Org membership management
- `orgDomainConfig` - Organization domain configuration
- `getBookerBaseUrl` - Organization-specific URLs

#### Teams
- `TeamRepository` - Team data access
- `TeamService` - Team operations
- `getParsedTeam`, `inviteMemberUtils` - Team utilities
- `updateNewTeamMemberEventTypes` - Team event type management
- `getTeamMemberEmailFromCrm` - CRM integration

#### Round-robin
- `roundRobinManualReassignment` - Manual reassignment
- `roundRobinReassignment` - Automatic reassignment
- `ManagedEventReassignmentService` - Managed event reassignment

#### Directory Sync (SCIM)
- `handleUserEvents` - SCIM user event handling
- `handleGroupEvents` - SCIM group event handling
- `inviteExistingUserToOrg` - User provisioning

#### Integration Attribute Sync
- `IntegrationAttributeSyncService` - Sync attributes with integrations
- `AttributeSyncRuleService` - Attribute sync rules
- `AttributeSyncFieldMappingService` - Field mapping

#### SSO & Authentication
- SAML, OIDC, SSO implementations
- Enterprise authentication flows

## Removal Strategy

### Phase 1: Analysis ✅
- [x] Document all /ee directories
- [x] Count files and size
- [x] Identify external imports (files outside /ee importing from /ee)
- [x] Catalog enterprise features

### Phase 2: Create Stubs & Fallbacks
Create minimal stub implementations for services that are deeply integrated:

```typescript
// Example stub for CreditService
export class CreditService {
  // Always returns success for open-source version
  async canBook() {
    return true;
  }
}
```

**Services that need stubs:**
- `CreditService` - Always allow bookings
- `WorkflowService` - No-op workflow methods
- `orgDomainConfig` - Return default config
- `getBookerBaseUrl` - Return standard URL

### Phase 3: Update Imports
Replace all imports from /ee with either:
1. **Remove import** - If feature is optional
2. **Stub import** - If service is required but can be no-op
3. **Move to core** - If functionality should be in open-source

**Files with most imports to update (50+ files):**
- `packages/trpc/server/routers/viewer/**/*.ts` - tRPC routers
- `packages/platform/libraries/index.ts` - Platform re-exports
- `packages/features/tasker/tasks/*.ts` - Background tasks
- `packages/features/bookings/**/*.ts` - Booking logic

### Phase 4: Remove Conditional Logic
Search for and remove feature flags/conditionals:
```typescript
// Remove patterns like:
if (isOrganization) { ... }
if (hasTeamBilling) { ... }
if (workflow) { ... }
```

### Phase 5: Delete /ee Directories
```bash
rm -rf packages/features/ee
rm -rf apps/web/modules/ee
rm -rf apps/api/v2/src/ee
rm -rf packages/ee
```

### Phase 6: Update Configuration
- Remove /ee paths from `tsconfig.json`
- Update `package.json` if needed
- Remove /ee-related environment variables from `.env.example`

### Phase 7: Verify Build
```bash
yarn install
yarn build
yarn test
```

## Risk Assessment

### High Risk Areas
1. **Booking confirmation flow** - Uses workflows, credits, org URLs
2. **Team invite flow** - Uses billing services, team repositories
3. **Platform API (v2)** - Heavily re-exports /ee functionality
4. **Event type creation** - Uses team/org services

### Medium Risk Areas
1. tRPC routers with /ee imports
2. Background tasker jobs
3. Routing forms
4. Event type components

### Low Risk Areas
1. UI components that conditionally show /ee features
2. Test files
3. Type-only imports

## Success Criteria
- [ ] All /ee directories deleted
- [ ] No import errors referencing /ee paths
- [ ] `yarn build` completes successfully
- [ ] Core booking flow works (create, confirm, cancel, reschedule)
- [ ] User signup and authentication works
- [ ] Event type creation works
- [ ] Basic scheduling works

## Rollback Plan
If issues arise, this is in a branch so we can:
1. Revert commits
2. Re-analyze specific failures
3. Add more comprehensive stubs
4. Move critical functionality to core instead of stubbing

## Timeline
This is a large refactor touching 738+ files. Estimated effort:
- Phase 2-3: Creating stubs and updating imports (largest effort)
- Phase 4: Removing conditionals
- Phase 5-7: Cleanup and verification

## Notes
- This creates the "truly free version" (cal.diy)
- The private cal.com repo will keep all /ee code
- Some features like teams, organizations, workflows will be completely unavailable in open-source version
- Focus on preserving core scheduling functionality
