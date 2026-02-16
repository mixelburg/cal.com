# Test Cleanup Summary - Cal.diy

## What Was Removed

### Phase 1: E2E Test Files (20 files, ~77KB)
**Commit**: 44982783ce

**Deleted**:
- 13 organization test files (entire `organization/` directory)
- 1 SAML SSO test (`saml.e2e.ts`)
- 1 attribute routing test (`attribute-routing.e2e.ts`)
- 1 managed event types test (`managed-event-types.e2e.ts`)
- 1 impersonation test (`impersonation.e2e.ts`)
- 4 insights dashboard tests (`insights*.e2e.ts`)

### Phase 2: Organization Fixtures & Helpers (4 files, ~20KB)
**Commit**: 54e721a2ff

**Deleted**:
- `apps/web/playwright/fixtures/orgs.ts` (1.8KB)
  - `createOrgsFixture()` for creating test organizations
- `apps/web/playwright/lib/orgMigration.ts` (18.6KB)
  - `moveUserToOrg()` and `removeUserFromOrg()` helpers
  - Complex org user migration logic

**Modified**:
- `change-username.e2e.ts` 
  - Removed org username migration test case
  - Removed `MembershipRole` and `moveUserToOrg` imports
- `lib/fixtures.ts`
  - Removed `orgs` fixture from `Fixtures` interface
  - Removed `createOrgsFixture` import and initialization

---

## Total Impact

**Files Removed**: 24 test files
**Code Deleted**: ~97KB (~6,600 lines)
**Commits**: 2

**Test Suite**:
- **Before**: 98 test files
- **After**: 74 test files
- **Reduction**: 24% fewer tests

---

## Remaining Test Suite (74 files)

### Core Features ✅ (Should Pass)
- **Teams** (3 files): teams.e2e.ts, team-invitation.e2e.ts, team-availability.e2e.ts
- **Payments** (1 file): payment.e2e.ts
- **Out-of-Office** (1 file): out-of-office.e2e.ts
- **Bookings** (12 files): booking-pages, confirm-reject, limits, seats, etc.
- **Event Types** (6 files): event-types, availability-tab, limit-tab, etc.
- **Auth & Login** (7 files): login, signup, 2FA, OAuth, forgot-password, etc.
- **Settings & Profile** (10 files): profile, availability, username, password, theme, etc.
- **Webhooks** (1 file): webhook.e2e.ts
- **Routing Forms** (1 file): basic.e2e.ts (attribute routing removed)
- **Embeds** (7 files): inline, action-based, preview, etc.
- **Misc** (25 files): icons, locale, filters, segments, etc.

### Features With Org Parameters Removed
- **change-username.e2e.ts**: Removed org username migration test case
- Other tests still have org-related fixture options but don't use them

---

## Test Commands (Updated)

### Critical Tests (~10 minutes)
```bash
yarn db-seed && yarn playwright test \
  apps/web/playwright/teams.e2e.ts \
  apps/web/playwright/team/team-invitation.e2e.ts \
  apps/web/playwright/payment.e2e.ts \
  apps/web/playwright/out-of-office.e2e.ts \
  apps/web/playwright/booking-pages.e2e.ts \
  apps/web/playwright/event-types.e2e.ts
```

### All Tests (~30-40 minutes)
```bash
yarn test-e2e
```

### Individual Tests
```bash
# Teams
yarn playwright test apps/web/playwright/teams.e2e.ts

# Payments
yarn playwright test apps/web/playwright/payment.e2e.ts

# Bookings (all)
yarn playwright test apps/web/playwright/booking*.e2e.ts
```

---

## Expected Results

### Should Pass ✅
All 74 remaining tests focus on core self-hosted features:
- ✅ Teams (basic CRUD, invitations, availability)
- ✅ Payments (all providers)
- ✅ Out-of-office
- ✅ Bookings (all variations)
- ✅ Event types
- ✅ Auth & user management
- ✅ Webhooks
- ✅ Embeds

### Won't Run ❌
Tests for removed EE features are deleted:
- ❌ Organizations (13 tests)
- ❌ SAML SSO (1 test)
- ❌ Attribute routing (1 test)
- ❌ Managed events (1 test)
- ❌ Impersonation (1 test)
- ❌ Insights (4 tests)

---

## Fixture Cleanup Status

### Removed ✅
- `orgs` fixture (organization creation/management)
- `orgMigration` helpers (user-to-org migration)

### Remaining (Core Features)
- `users` - User creation and management
- `bookings` - Booking fixtures
- `payments` - Payment fixtures
- `embeds` - Embed fixtures
- `servers` - Server fixtures
- `emails` - Email fixtures
- `routingForms` - Routing form fixtures
- `bookingPage` - Booking page helpers
- `workflowPage` - Workflow page helpers (workflows removed but fixture kept for now)
- `features` - Feature flag fixtures
- `eventTypePage` - Event type page helpers
- `appsPage` - Apps page helpers
- `webhooks` - Webhook fixtures

### Note on Organization Parameters
Some fixtures (like `users.ts` `createTeam()`) still have organization-related parameters (`isOrg`, `isOrgVerified`, `organizationId`) in their signatures. These are:
- **Harmless**: Just optional params in test data creation
- **Unused**: No remaining tests pass these params
- **Safe to keep**: No runtime impact, maintains backward compatibility if we ever want to re-enable

Could be cleaned up in a future pass if desired.

---

## Next Steps

1. ✅ **Setup database** (PostgreSQL + migrations)
2. ✅ **Configure .env** (DATABASE_URL, NEXTAUTH_SECRET, etc.)
3. ✅ **Run critical tests** (6 tests, ~10 minutes)
4. ⏳ **Review results** and fix any failures
5. ⏳ **Run full suite** (optional, ~40 minutes)

---

**Status**: ✅ Test suite cleaned and ready for validation
**Test Files**: 74 remaining (24 removed, 24% reduction)
**Code Removed**: ~97KB
**Focus**: 100% on cal.diy core features
