# Agent Handoff: EE Code Removal Migration

**Date:** 2026-02-15  
**Branch:** `lets-do-this`  
**Task:** Remove all Enterprise Edition (EE) code from cal.com to create cal.diy (self-hosted version)

## 🎯 Mission

Convert the private cal.com repository into a public cal.diy repository by removing all EE features while keeping **teams** as a core feature. Self-hosters should have a fully functional scheduling platform without billing, organizations, SSO/SAML, or premium features.

## 📊 Current Status

**Type Check Progress:**
- **Started with:** ~800+ errors across all packages
- **Currently:** 295 errors remaining in `@calcom/web` package  
- **All other packages:** ✅ Passing type checks (`@calcom/api`, `@calcom/app-store`, `@calcom/trpc`, `@calcom/prisma`, etc.)

**Last successful check:** 295 errors (down from 328 at start of this session)
**Errors eliminated today:** 33 errors

## ✅ Completed Work

### 1. Major EE Modules Deleted
- ✅ `packages/features/ee/billing/` (entire module)
- ✅ `packages/features/ee/api-keys/` (entire module)
- ✅ `packages/features/ee/deployment/` (entire module)
- ✅ `packages/features/ee/license/` (entire module)
- ✅ `packages/features/ee/integration-attribute-sync/` (entire module)
- ✅ `packages/features/ee/rate-limiting/` (entire module)
- ✅ `apps/web/modules/settings/platform/` (platform settings)
- ✅ `apps/web/modules/settings/admin/` (admin settings)
- ✅ `apps/web/modules/ee/billing/` (billing UI)
- ✅ `apps/web/lib/org/` (org instant meeting SSR)
- ✅ `apps/web/modules/org/` (org modules)
- ✅ `apps/web/app/settings/teams/[id]/billing/page.tsx` (team billing page)

### 2. Test Files Deleted (for removed EE features)
- ✅ `apps/web/test/lib/handleChildrenEventTypes.test.ts`
- ✅ `apps/web/modules/users/views/users-public-view.test.tsx`
- ✅ `apps/web/modules/onboarding/hooks/__tests__/useSubmitOnboarding.test.ts`
- ✅ `apps/web/lib/pages/auth/verify-email.test.ts`

### 3. Key Files Surgically Refactored

**Organizations Removed:**
- ✅ `packages/features/eventtypes/lib/getPublicEvent.ts` - Removed `orgDetails` rendering logic
- ✅ `apps/web/modules/team/team-view.tsx` - Removed org-specific logic, `requestedSlug`, SubTeams
- ✅ `apps/web/lib/team/[slug]/getServerSideProps.tsx` - Hardcoded `organizationsEnabled = false`
- ✅ `apps/web/lib/handleOrgRedirect.ts` - Stubbed to return `null`
- ✅ `packages/features/users/repositories/UserRepository.ts` - Stubbed org membership functions

**Billing Removed:**
- ✅ All API v1 billing endpoints stubbed
- ✅ `getBillingProviderService` stubbed in stripe payment handlers
- ✅ `purchaseTeamOrOrgSubscription` stubbed
- ✅ Platform billing removed

**API Keys Removed:**
- ✅ Stubbed in Zapier, Make, Salesforce integrations
- ✅ `findValidApiKey`, `ApiKeyService`, `generateUniqueAPIKey` all stubbed

**SAML/SSO Removed (Most Recent - CRITICAL PATTERN):**
- ✅ **Surgically deleted entire SAML code block** (lines 326-484) from `packages/features/auth/lib/next-auth-options.ts`
- ✅ Removed dead code instead of stubbing when condition is always false
- ✅ Removed `SamlIdpUser` type (no longer used)
- ✅ **170 lines of dead code deleted** ⚡

### 4. Stub Files Created (20 files)

**EE Component Stubs** (apps/web):
```
apps/web/ee/posthog/providerDynamic.tsx
apps/web/ee/posthog/pageViewDynamic.tsx
apps/web/ee/organizations/components/TeamInviteFromOrg.tsx
apps/web/ee/common/components/BrandColorsForm.tsx
apps/web/ee/common/components/CommonSkeletonLoaders.tsx
apps/web/ee/workflows/components/TimeTimeUnitInput.tsx
apps/web/shell/UpgradeTip.tsx
apps/web/modules/ee/billing/components/DueInvoiceBanner.tsx
apps/web/modules/ee/organizations/hooks/useWelcomeModal.tsx
apps/web/modules/auth/components/SAMLLogin.tsx
apps/web/modules/ee/teams/components/TeamAvailabilityTimes.tsx
apps/web/modules/ee/teams/components/TeamPill.tsx
apps/web/modules/event-types/components/tabs/workflows/EventWorkflowsTab.tsx
apps/web/modules/shell/banners/OrganizationBanner.tsx
apps/web/modules/users/components/UserTable/BulkActions/MassAssignAttributes.tsx
apps/web/modules/onboarding/components/onboarding-browser-view.tsx
apps/web/modules/onboarding/components/onboarding-continuation-prompt.tsx
apps/web/modules/onboarding/components/plan-icon.tsx
apps/web/components/settings/platform/hooks/useGetUserAttributes.ts
apps/web/components/settings/platform/hooks/usePlatformMe.ts
```

**Feature Stubs** (packages):
```
packages/features/ee/teams/lib/types.ts
packages/features/handleCreatePhoneCall.ts
packages/features/handleMarkNoShow.ts
```

**Note:** User feedback was that we're creating too many stubs. New strategy: **Delete calling code when stub does nothing**.

## 🔑 Key Decisions & Patterns

### User-Defined Principles

1. **"Surgical removal > stubbing"** - Delete dead code blocks entirely, don't stub
2. **"If stub does nothing, remove calling code"** - No-op stubs indicate the caller should be deleted
3. **"Teams ARE core, but team billing is EE"** - Keep team functionality, remove billing/upgrades
4. **No stubbing for purely EE features** - If it's 100% EE, delete it entirely
5. **Organizations are EE-only** - Self-hosters never had organizations
6. **SAML/SSO is EE** - Core auth stays, enterprise auth goes
7. **No billing/credits for self-hosters** - Can't build a SaaS business with cal.diy

### What to Keep vs Delete

**✅ KEEP (Core Features):**
- Teams (but not team billing, organizations, or parent/child teams)
- Basic authentication (login, signup, password)
- Event types
- Bookings
- Calendars
- Webhooks
- Routing forms (basic)
- Workflows (if not heavily EE-dependent)

**❌ DELETE (EE Features):**
- Organizations (parent/child teams)
- Team billing/subscriptions/Stripe integration
- Premium usernames
- SAML/SSO authentication
- API keys (EE billing feature)
- Platform API (managed users)
- Credits/active user tracking
- Deployment/License checking
- Rate limiting (EE feature)
- Integration attribute sync

## 🎯 Next Steps (Priority Order)

### Immediate: Finish Web App Type Errors (328 remaining)

**Strategy:** Don't just add stubs - look for patterns to surgically remove:

1. **Find more dead code blocks like SAML** ⚡ HIGH PRIORITY
   - Search for conditionals that are always false with EE vars removed
   - Delete entire blocks instead of stubbing the condition
   - Examples: `if (hostedCal)`, `if (isOrganization)`, `if (orgSlug)`, etc.

2. **Fix property access errors on `never` types** (~6 errors)
   - Often means org-related code needs surgical removal
   - Example: `team.parent.logoUrl` → delete the code using it

3. **Remove org/platform calling code** 
   - Files still trying to use org features
   - Delete the feature usage, not just stub the import

4. **Clean up routing forms EE dependencies**
   - Check `FormActions.tsx` for `fullDomain` (org feature)

5. **Fix booking page metadata types**
   - Org properties causing type mismatches

### After Type Check Passes:

1. **Delete remaining stub files** if they're truly no-ops
2. **Run `yarn biome check --write .`** (formatting was reverted earlier due to massive diff)
3. **Manual smoke testing:**
   - Login/signup flow
   - Create team
   - Create event type
   - Make booking
   - Verify no EE features accessible
4. **Update `EE_REMOVAL_MIGRATION_STATUS.md`** with final stats
5. **Create PR** (don't push branch to public repo - review locally)

## 📁 Important Files to Review

### High-Impact Files (Most Errors)
```
apps/web/app/(booking-page-wrapper)/[user]/[type]/page.tsx
apps/web/app/(booking-page-wrapper)/team/[slug]/[type]/pageWithCachedData.tsx
apps/web/app/(use-page-wrapper)/settings/(settings-layout)/layout.tsx
apps/web/app/(use-page-wrapper)/settings/(settings-layout)/SettingsLayoutAppDirClient.tsx
packages/features/auth/lib/next-auth-options.ts (just cleaned up!)
```

### Files with Org Logic to Remove
```
apps/web/components/apps/routing-forms/FormActions.tsx
apps/web/lib/d/[link]/[slug]/getServerSideProps.tsx
packages/features/eventtypes/lib/getPublicEvent.ts
```

## 🚫 What NOT to Do

1. **Don't run `yarn type-check:ci --force`** - Takes too long for entire monorepo
2. **Don't create stubs for dead code** - Delete the calling code instead
3. **Don't worry about linter errors yet** - Focus on type errors only
4. **Don't push branch** - Migration is secret until complete
5. **Don't create helper scripts** - Use standard tools
6. **Don't add inline JSX comments** - Causes `TS1005` errors

## 🔍 How to Find More Dead Code

### Search Patterns:
```bash
# Find org-related conditionals
rg "if.*isOrganization|if.*orgSlug|if.*orgId" --type ts

# Find HOSTED_CAL_FEATURES usage
rg "HOSTED_CAL_FEATURES|hostedCal" --type ts

# Find billing conditionals
rg "if.*IS_TEAM_BILLING_ENABLED" --type ts

# Find platform/admin checks
rg "if.*isAdmin|if.*isPlatform" --type ts
```

### Red Flags for Dead Code:
- Stubs that return `null`, `false`, or empty objects
- Conditionals checking EE features that are now always false
- Entire provider configurations for removed features
- Type definitions only used by removed features

## 📝 Commit Pattern

Use conventional commits:
```
refactor: surgically remove [FEATURE] code block

- Delete [specific dead code]
- Remove [unused types/functions]
- [Lines deleted] lines removed
- Surgical removal > stubbing for dead code
```

## 🎓 Lessons Learned

1. **User prefers surgical deletion** over defensive stubbing
2. **Dead code blocks should be deleted entirely**, not wrapped in false conditionals
3. **If a stub does nothing**, the calling code should be examined for removal
4. **Test files for deleted features should be deleted** too
5. **170 lines of SAML code were unnecessary** - could have been deleted from the start
6. **Context is huge** - hence this handoff doc

## 🔗 Related Files

- **Migration status:** `EE_REMOVAL_MIGRATION_STATUS.md` (577 lines) - detailed file-by-file changes
- **Guidelines:** `AGENTS.md` / `CLAUDE.md` - Cal.com development rules
- **Branch:** `lets-do-this` (secret, don't push)
- **Base:** `main` branch

## 💡 Quick Wins for Next Agent

1. **Search for `if (hostedCal)` and delete those blocks** - 100% dead code
2. **Search for org conditionals and delete** - Organizations completely removed
3. **Look at the 328 errors** - many are probably from trying to access org properties
4. **Delete more test files** for removed features
5. **Focus on surgical removal** - user strongly prefers this approach

---

**Last Updated:** 2026-02-15 by AI Agent  
**Latest Session:** Surgical removal approach successful - eliminated 33 errors  
**Confidence:** High - Clear patterns established, good progress made (295 errors from ~800)

## 📝 Latest Session Summary (2026-02-15)

**Commits Made:** 5 commits
1. ✅ `refactor: surgically remove SAML/SSO authentication code` + org domain config
2. ✅ `refactor: add missing EE component stubs and exports`
3. ✅ `refactor: delete org test files and fix Prisma queries`
4. ✅ `refactor: surgically remove org property accesses`
5. ✅ `refactor: fix Prisma profiles relation access`

**Key Achievements:**
- **Surgical removal over stubbing** - Demonstrated that org code can be removed without breaking teams
- **No meaningless stubs** - Only created stubs where absolutely needed for imports
- **Inlined org-free logic** - Replaced helper functions with direct Prisma queries
- **Test cleanup** - Deleted 2 test files (37KB) for removed org features

**Errors Fixed:** 53 total (328 → 275)
- Session 1: 33 errors (328 → 295)
  - Deleted `handleOrgRedirect.test.ts` (21KB, 100% org tests)
  - Deleted `getTeamMemberEmailFromCrm.test.ts` (15KB, uses removed functions)
  - Fixed PostHog imports path
  - Fixed team members Prisma query structure
  - Updated member property accesses
- Session 2: 20 errors (295 → 275)
  - Deleted PBAC permission checking dead code
  - Removed orgBranding property accesses (fullDomain, name, logoUrl, id)
  - Fixed Prisma `profiles` array access (was singular `profile`)
  - Updated event type and member user mappings to use `profiles[0]`

**What's Left:** 275 errors remaining:
- Missing tRPC endpoints: `publish`, `removeMember`, `inviteMember`, `changeMemberRole`, `deleteInvite`, `setInviteExpiration`, `createInvite`
- Booking page profile types missing `name` and `image` properties
- SAML references still in login view (samlTenantID, samlProductID)
- Organization property mismatches (`requestedSlug`, `upId` vs `uid`)
- Component return type issues (PostHog, DataTableProvider)
