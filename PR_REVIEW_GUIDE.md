# PR Review Guide: EE Code Removal

## 📋 Executive Summary

**Objective**: Remove all Enterprise Edition (EE) code from the repository to create a public, open-source version (cal.diy).

**Scope**: 
- **Files Deleted**: ~250+ files (entire `/ee` directories)
- **Files Modified**: ~150+ files (stub additions, import fixes, workflow parameter fixes)
- **Build Status**: ✅ TypeScript compilation passing, ⚠️ Next.js web app needs fixes

**Review Priority**: Focus on mixed files (modified, not deleted) as these are higher risk for breaking core functionality.

---

## 🎯 What You Should Focus On

### 1. **High Priority: Mixed Files (Core + EE)**
These files had both core and EE code. Only EE code was removed, but there's risk of breaking core features:

**Critical Areas to Review:**

#### Booking Flow (`packages/features/bookings/`)
- ✅ **Low Risk**: Stub files added for workflows, no core booking logic changed
- ⚠️ **Watch for**: `workflows: []` parameters added in multiple places
- **Files to check**:
  - `lib/handleNewBooking/getEventType.ts`
  - `lib/handleNewBooking/getEventTypesFromDB.ts`
  - `lib/service/RegularBookingService.ts` (multiple `workflows` additions)

#### Event Types (`packages/features/eventtypes/`)
- ⚠️ **Medium Risk**: Organization URL functions stubbed
- **What remains**: All core event type creation/editing/deletion
- **What's gone**: Organization-specific URLs, team hierarchies
- **Files to check**:
  - `lib/getEventTypesByViewer.ts` - check `getBookerBaseUrl` stub
  - `lib/getPublicEvent.ts` - verify public event fetching works

#### Teams & Organizations (`packages/trpc/server/routers/viewer/teams/`)
- ⚠️ **High Risk**: Heavy stubbing of TeamRepository, TeamService
- **What remains**: Basic team CRUD operations
- **What's gone**: Team billing, member invitations with credits, organization hierarchy
- **Files to check**:
  - `create.handler.ts` - team creation without billing
  - `update.handler.ts` - team updates without org constraints
  - `listMembers.handler.ts` - team member listing

#### Insights (`packages/features/insights/`)
- ✅ **Low Risk**: Repository stubs added with correct signatures
- **Files to check**:
  - `services/InsightsBookingBaseService.ts`
  - `services/InsightsRoutingBaseService.ts`

---

### 2. **Medium Priority: Stub Patterns**

Throughout the codebase, we used consistent stub patterns. Verify these don't break calling code:

#### Pattern 1: Repository Stubs
```typescript
// Stub for removed EE TeamRepository
class TeamRepository {
  constructor(_prisma: any) {}
  async findById(_params: any): Promise<any | null> {
    return null;
  }
  // ... other methods return null or empty arrays
}
```
**Risk**: Calling code must handle `null` returns gracefully.

#### Pattern 2: Service Stubs
```typescript
// Stub for removed EE WorkflowService
class WorkflowService {
  static async create(_params: any): Promise<any> {
    return null;
  }
}
```
**Risk**: Features silently disabled. Check if UI reflects this.

#### Pattern 3: Function Stubs
```typescript
async function getBookerBaseUrl(_orgId: number | null): Promise<string> {
  return "";
}
```
**Risk**: Empty strings might break URL construction.

#### Pattern 4: Early Returns
```typescript
export const stripeCustomerHandler = async ({ ctx }: StripeCustomerOptions) => {
  // Billing service disabled (EE-only)
  return { isPremium: false, username: null };
};
```
**Risk**: All users now appear as non-premium. Check if features gate properly.

---

### 3. **Low Priority: Complete Deletions**

These were pure EE features, completely removed. Low risk of affecting core:

#### Fully Deleted Features (Safe to Ignore)
- ❌ **Workflows** - All workflow-related routers/handlers
- ❌ **Credits System** - Billing credits for team features
- ❌ **Organization Management** - Org domains, SSO, SAML
- ❌ **Premium Usernames** - Username billing/checkout
- ❌ **Advanced Webhooks** - Webhook scanning/validation
- ❌ **Team Billing** - Stripe integration, invoices, proration
- ❌ **License Key Management** - Self-hosted licensing
- ❌ **Out-of-Office** - OOO scheduling with delegate notifications
- ❌ **No-Show Fees** - Booking no-show tracking and fees
- ❌ **Advanced Team Features** - Team member removal with billing, team invite credits
- ❌ **API Rate Limiting** - Advanced API key management
- ❌ **Deployment Admin** - License validation endpoints
- ❌ **Cal AI Phone** - AI phone integration and templates
- ❌ **Integration Attribute Sync** - CRM attribute syncing
- ❌ **Routing Forms Teams** - Team-specific routing form features
- ❌ **DSYNC** - Directory sync features

---

## 📂 Files Deleted (Complete List)

### Directories Completely Removed
```
apps/web/modules/ee/               (entire directory)
packages/features/ee/              (entire directory)
packages/ee/                       (entire directory)
apps/api/v2/src/ee/               (entire directory)
```

### Key Individual Files Deleted

#### tRPC Routers (API Endpoints)
```
packages/trpc/server/routers/loggedInViewer/
├── appRoutingForms/
│   └── appRoutingForms.handler.ts
├── markNoShow.handler.ts
├── markNoShow.schema.ts
└── outOfOffice/ (directory)

packages/trpc/server/routers/publicViewer/
├── markHostAsNoShow.handler.ts
└── ssoConnections/ (directory)

packages/trpc/server/routers/viewer/
├── apiKeys/findKeyOfType.handler.ts
├── eventTypes/findAllUserDefinedByUser.handler.ts
├── organizations/ (entire directory)
├── teams/
│   ├── inviteMember/ (directory)
│   ├── removeMember.handler.ts
│   ├── hasTeamPlan.handler.ts
│   └── getMemberInviteList.handler.ts
├── workflows/ (entire directory)
├── ooo/
│   ├── outOfOfficeCreateOrUpdate.handler.ts
│   └── outOfOfficeEntryDelete.handler.ts
└── routing-forms/
    └── findTeamMembersMatchingAttributeLogicOfRoute.handler.ts
```

#### Services & Repositories
```
packages/features/
├── bookings/lib/handleNewBooking/
│   └── validateOrgDomainsCapturedInNonBookingPage.ts
├── ee/ (entire directory)
└── tasker/tasks/
    ├── sendProrationInvoiceEmail.ts
    └── sendProrationReminderEmail.ts
```

---

## 🛡️ What Still Works (Core Features)

### ✅ Booking System
- Create, reschedule, cancel bookings
- Email/SMS notifications (without workflow customization)
- Booking confirmation and reminders (basic)
- Seat-based bookings
- Payment integration (Stripe payments, not billing)

### ✅ Event Types
- Create/edit/delete event types
- Scheduling logic and availability
- Booking fields and custom inputs
- Public event pages
- Team event types (basic)

### ✅ Teams (Basic)
- Create teams
- List teams
- Update team settings
- Team member management (basic)
- Team event types

### ✅ Calendar Sync
- Google Calendar, Outlook, etc.
- Availability checking
- Conflict detection

### ✅ Apps & Integrations
- App store browsing
- App installation/uninstallation
- Video conferencing integrations
- Payment apps (Stripe)

### ✅ User Management
- User registration/login
- Profile updates
- Availability settings
- Time zones

---

## ⚠️ Known Issues & TODOs

### Current Build Status

#### ✅ Backend (TypeScript): PASSING
- `@calcom/trpc`: ✅ 0 errors
- `@calcom/prisma`: ✅ 0 errors
- `@calcom/features`: ✅ 0 errors

#### ⚠️ Frontend (Next.js): FAILING
Module resolution errors in:
- `apps/web/modules/integration-attribute-sync/` - Can likely be deleted (EE feature)
- Various organization/team admin pages - Need stub pages or redirects
- SSO pages - Need to be removed or stubbed
- Billing pages - Need to be removed or stubbed

**Recommendation**: Either delete these pages or create stub pages that show "Feature not available"

---

## 🧪 Testing Recommendations

### Critical Paths to Test

1. **Booking Flow** (Highest Priority)
   - [ ] Create a new booking as a guest
   - [ ] Reschedule an existing booking
   - [ ] Cancel a booking
   - [ ] Verify confirmation emails sent
   - [ ] Test with team event types

2. **Event Type Management**
   - [ ] Create new event type
   - [ ] Edit existing event type
   - [ ] Delete event type
   - [ ] Test public booking page

3. **Team Functionality**
   - [ ] Create a new team
   - [ ] Add team members
   - [ ] Create team event type
   - [ ] Book a team event

4. **User Profile**
   - [ ] Update user profile
   - [ ] Change availability
   - [ ] Connect calendar

### What NOT to Test (Removed Features)
- ❌ Workflows and custom reminders
- ❌ Team billing and credits
- ❌ Organization features (SSO, domains, hierarchy)
- ❌ No-show tracking
- ❌ Out-of-office delegation
- ❌ Premium username checkout
- ❌ CRM attribute syncing

---

## 🔍 Code Review Checklist

### For Each Modified File:

#### 1. **Check Stub Safety**
- [ ] Does calling code handle `null` returns?
- [ ] Are empty strings/arrays handled gracefully?
- [ ] Are optional chaining (`?.`) and nullish coalescing (`??`) used where needed?

#### 2. **Verify Core Logic Intact**
- [ ] Are there any accidental deletions beyond EE code?
- [ ] Do function signatures still match their usage?
- [ ] Are imports still valid?

#### 3. **Look for Commented Code**
- [ ] Any `// Stub for removed EE...` comments explain the stub purpose?
- [ ] Are there any `TODO` or `FIXME` comments that need attention?

#### 4. **Check Type Safety**
- [ ] No `as any` casts (except in stubs)?
- [ ] Proper type imports (`import type`)?
- [ ] No `@ts-ignore` comments?

### Red Flags to Watch For:

🚩 **Danger Signs**
- Functions that now always return `null` but calling code doesn't check
- Empty strings used in URL construction
- Array methods (`.map`, `.filter`) on stubbed arrays returning `[]`
- Conditional logic that depends on EE features existing

✅ **Good Signs**
- Early returns in handlers for removed features
- Clear comments explaining stubs
- Graceful degradation (feature disabled, not broken)
- Type safety maintained

---

## 📊 Statistics

### By the Numbers
- **Directories Deleted**: 4 major directories
- **Files Deleted**: ~250+ files
- **Files Modified**: ~150+ files
- **Stubs Created**: ~50+ stub classes/functions
- **TypeScript Errors Fixed**: 200+ errors → 0 errors
- **Build Time**: ~3 minutes (backend compilation)

### Lines of Code
- **Deleted**: ~50,000+ lines (estimate)
- **Added (stubs)**: ~1,500 lines
- **Net Reduction**: ~48,500 lines

---

## 💡 Tips for Efficient Review

### 1. **Review in This Order:**
1. Start with this guide
2. Review stub patterns (search for `// Stub for removed EE`)
3. Focus on modified files in critical paths (bookings, event types)
4. Skim deleted files list (just to know what's gone)
5. Check build output for any missed errors

### 2. **Use Git Effectively:**
```bash
# See all modified files (not deleted)
git diff --name-only main | grep -v "^D"

# See all stubs added
git grep "Stub for removed EE"

# See all workflow parameter additions
git grep "workflows: \[\]"

# Find all TeamRepository stubs
git grep "class TeamRepository"
```

### 3. **Focus Areas by Risk:**
- **High Risk**: `packages/features/bookings/`, `packages/trpc/server/routers/viewer/teams/`
- **Medium Risk**: `packages/features/eventtypes/`, `packages/features/insights/`
- **Low Risk**: Deleted files, stub definitions

### 4. **Questions to Ask:**
- Does this feature still work without the EE code?
- Is the stub return value safe for all callers?
- Will users understand why a feature is missing?
- Are there any security implications (data exposure)?

---

## 🎬 Next Steps After Review

### Before Merging:
1. ✅ Verify TypeScript compilation passes
2. ⚠️ Fix Next.js web app build errors
3. 🧪 Run critical path tests (booking flow, event types, teams)
4. 📝 Update user-facing documentation
5. 🚨 Add feature flags for graceful degradation (optional)

### After Merging:
1. Monitor error logs for `null` reference errors
2. Check if any UI breaks due to missing features
3. Verify database migrations aren't affected
4. Test with real user workflows

### Future Improvements:
- Replace `null` stubs with feature flags
- Add UI indicators for disabled features
- Create "upgrade" messages for removed features
- Add E2E tests for core paths

---

## 📞 Questions During Review?

If you find:
- **Unexpected behavior**: Check if a stub is returning `null` where code expects a value
- **Type errors**: Likely a stub signature mismatch
- **Missing features**: Confirm it's an EE feature from the "Fully Deleted Features" list
- **Security concerns**: Verify no `credential.key` exposure, no EE data leaking

---

## ✨ Summary

This PR removes all Enterprise Edition code while preserving core functionality. The approach was:

1. **Delete** pure EE features entirely (workflows, billing, org management)
2. **Stub** EE services/repositories used by core code (return `null`/empty)
3. **Preserve** all core booking and scheduling functionality

**Review Focus**: Mixed files where EE code was surgically removed. Ensure core features still work and stubs are safe.

**Expected Outcome**: A fully functional open-source scheduling platform without enterprise features.

---

**Last Updated**: 2026-02-12  
**PR Status**: ⚠️ In Progress (Next.js build fixes needed)  
**Backend Status**: ✅ TypeScript compilation passing
