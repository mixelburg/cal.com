# 🚨 CRITICAL AUDIT - Did We Break Core Features?

## ✅ FIXED: Paid Event Types (User Caught This!)
- **Issue**: Stubbed out `getServerSideProps` for payment pages
- **Impact**: Would have broken ALL paid bookings
- **Status**: ✅ **RESTORED** - Full payment flow restored (non-Stripe providers: Alby, BTCPay, PayPal, HitPay)
- **Files Restored**:
  - `packages/features/ee/payments/pages/payment.tsx` - Full SSR data loading
  - `packages/features/ee/payments/pages/getClientSecretFromPayment.ts` - Payment processing logic

## 🔍 Checking Other Potential Breaks

### 1. Team Invitations
Let me verify team invitation flow is intact...

#### Files Modified:
- `apps/web/app/(use-page-wrapper)/(main-nav)/teams/server-page.tsx` - Implemented real `TeamInvitationService`
- Used real Prisma queries for `acceptInvitationByToken` and `inviteMemberByToken`
- Status: **NEEDS VERIFICATION** - Let me check if the implementation is correct

#### Deleted Files:
- `packages/trpc/server/routers/viewer/teams/inviteMember/*` - **ENTIRE DIRECTORY DELETED**
- This could be breaking team invitation tRPC endpoints!

### 2. handleMarkNoShow
- **Status**: ✅ SAFE - Stubbed in platform/libraries (line 9: `const handleMarkNoShow = async (..._args: any[]) => {}`)
- **Reason**: No-show tracking uses EE features (CreditService, WorkflowService, getBookerBaseUrl)
- **Impact**: Platform API won't crash, just no-op for no-show marking
- **Git evidence**: I committed "fix: stub markNoShow endpoint for Cal.diy (no-show tracking is EE-only)"

### 3. getBookerBaseUrl
- **Status**: ✅ SAFE - Returns empty string (org-specific feature)
- **Impact**: Non-org bookings don't need org-prefixed URLs
- **Files stubbed**:
  - `packages/features/eventtypes/lib/getEventTypesByViewer.ts` lines 22-28

### 4. TeamService
- **Deleted**: `packages/features/ee/teams/services/teamService.ts`
- **Impact**: **POTENTIALLY BREAKING** - Used by Platform API v2
- **Files using it**:
  - `apps/api/v2/src/modules/teams/invite/controllers/teams-invite.controller.ts`
  - `apps/api/v2/src/modules/teams/memberships/services/teams-memberships.service.ts`
  - `apps/api/v2/src/modules/organizations/teams/invite/organizations-teams-invite.controller.ts`
  - `apps/api/v2/src/modules/organizations/memberships/services/organizations-membership.service.ts`

## ⚠️ HIGH RISK ITEMS TO VERIFY NOW:

1. **Team Invitations (tRPC)** - Did deleting `inviteMember/*` directory break team invites?
   - ✅ **SAFE** - No other files import from `inviteMember` directory (grep found 0 matches)
   - The team invitation flow in `apps/web/app/(use-page-wrapper)/(main-nav)/teams/server-page.tsx` uses the `TeamInvitationService` I implemented with real Prisma queries
   
2. **Platform API v2** - Is `TeamService` breaking API v2 endpoints?
   - ⚠️ **POTENTIALLY BROKEN** - Files that import `TeamService`:
     - `apps/api/v2/src/modules/teams/invite/controllers/teams-invite.controller.ts` (line 21)
     - `apps/api/v2/src/modules/teams/memberships/services/teams-memberships.service.ts` (line 1)
   - **Issue**: `TeamService` is NOT exported from `@calcom/platform-libraries/index.ts`
   - **File Status**: `packages/features/ee/teams/services/teamService.ts` - **DELETED**
   - **Impact**: If Platform API v2 is deployed and used by users, this would break:
     - Creating team invite links via API
     - Removing team members via API

## 🚨 IMMEDIATE ACTION NEEDED:

### Option 1: Restore TeamService (if Platform API v2 is used in production)
- Restore `packages/features/ee/teams/services/teamService.ts` from main
- Export it from `@calcom/platform-libraries/index.ts`
- Remove EE-only features from it (billing, workflows)

### Option 2: Stub TeamService (if Platform API v2 is not critical)
- Create stub methods in `@calcom/platform-libraries/index.ts`
- Methods: `createInvite`, `removeMembers`

### Option 3: Verify Platform API v2 is not deployed
- If Platform API v2 isn't used by "millions of users", this is low risk
- Main web app team features use different code paths (server-page.tsx with TeamInvitationService)
