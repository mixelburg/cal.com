# EE vs Core Feature Analysis (from main branch)

**Date:** 2026-02-15  
**Source:** `main` branch inspection + official EE README.md

## TL;DR - Executive Summary

### ✅ What's CORE (Keep for cal.diy)
- **Teams:** CRUD operations, memberships, team pages
- **Team Event Types:** Creation logic, booking engine for COLLECTIVE scheduling
- **Collective Events:** Listed on cal.com as general resource (not enterprise-only)
- **Location:** `packages/trpc/server/routers/viewer/teams/` (AGPL-licensed)

### ❌ What's EE (Must remove) - CONFIRMED by https://cal.com/enterprise
- **Round-robin routing:** Explicitly listed as Enterprise feature on marketing site
- **Attribute-based routing:** Enterprise feature for matching by location/specialty
- **TeamEventTypeForm UI:** Form to create team event types with scheduling type selection
- **Managed event types:** Template/inheritance system
- **Sub-teams (unlimited):** Parent/child team hierarchy (organizations)
- **Team billing:** Trial logic, payment processing, centralized billing
- **Insights dashboard:** Analytics for bookings
- **SAML SSO, SCIM, RBAC:** Security features
- **Location:** `packages/features/ee/teams/`, `packages/features/ee/round-robin/`, etc.

### 🎯 Decision for cal.diy
**Keep teams with COLLECTIVE scheduling only:**
1. Remove `TeamEventTypeForm` (EE UI)
2. Use core `CreateEventTypeForm` for team events
3. Auto-inject `teamId` and default to `COLLECTIVE` scheduling
4. No UI choice for scheduling type (COLLECTIVE is hardcoded for teams)

---

## CRITICAL FINDING: Teams ARE Core! 🎉

### License Analysis (OFFICIAL)

From official EE `README.md`:
```
The /ee subfolder is the place for all the Enterprise Edition features from our 
hosted plan and enterprise-grade features for Enterprise such as SSO, SAML, OIDC, 
SCIM, SIEM and much more or Platform plan to build a marketplace.

❗ WARNING: This repository is copyrighted (unlike our main repo). You are not 
allowed to use this code to host your own version without obtaining a proper 
license first ❗
```

From `LICENSE` file at root:
```
All content that resides under:
- packages/features/ee/ (Commercial License)
- apps/api/v2/src/ee (Commercial License)

Content OUTSIDE these directories = AGPLv3 (Open Source)
```

**Rule:** Anything in `/ee` folders = Enterprise Edition (must remove for cal.diy)

### Team Functionality Breakdown

#### ✅ CORE (AGPL-licensed, keep for cal.diy)
**Location:** `packages/trpc/server/routers/viewer/teams/`
- `get.handler.ts` - Get team details
- `list.handler.ts` - List user's teams  
- `create.handler.ts` - Create team
- `update.handler.ts` - Update team
- `updateMembership.handler.ts` - Update member roles
- Basic team CRUD operations

**Schema:** Team model in `packages/prisma/schema.prisma` (core)

**Booking Logic:** `packages/features/bookings/lib/handleNewBooking/test/team-bookings/`
- COLLECTIVE scheduling tests
- ROUND_ROBIN scheduling tests
- Core booking engine supports team event types

#### ❌ ENTERPRISE (Commercial License, must remove for cal.diy)
**Location:** `packages/features/ee/teams/`
- `components/TeamEventTypeForm.tsx` - UI for creating team event types with scheduling selection
- `lib/payments.ts` - Team billing logic
- `lib/inviteMemberUtils.ts` - Invitation utilities
- `services/` - EE team services

**Location:** `packages/features/ee/round-robin/`
- Manual reassignment features
- Automatic reassignment logic
- Assignment reason tracking

**Location:** `packages/features/ee/managed-event-types/`
- Template/inheritance system
- Admin-managed event type features

**Billing files in viewer.teams router:**
- `skipTeamTrials.handler.ts`
- `skipTrialForTeam.handler.ts`
- `checkIfUserJoinedViaInviteHandler.ts`

## Key Schema Finding

```typescript
// From packages/features/eventtypes/lib/schemas.ts
.refine((data) => (data.teamId ? data.teamId && data.schedulingType : true), {
  path: ["schedulingType"],
  message: "You must select a scheduling type for team events",
});
```

**Team event types REQUIRE a scheduling type.** Can't create without one.

### Scheduling Types (Prisma enum)
```prisma
enum SchedulingType {
  ROUND_ROBIN @map("roundRobin")
  COLLECTIVE  @map("collective")
  MANAGED     @map("managed")
}
```

## Analysis: Which Scheduling Types to Keep?

### 1. COLLECTIVE
- **EE UI:** TeamEventTypeForm (in /ee) ❌
- **Core Logic:** Booking tests exist, logic in core ✅
- **Assessment:** Booking works in core, only creation UI is EE

### 2. ROUND_ROBIN
- **EE UI:** TeamEventTypeForm (in /ee) ❌
- **EE Features:** Reassignment, manual assignment (in /ee) ❌
- **Core Logic:** Booking tests exist, loadAndValidateUsers handles it ✅
- **Assessment:** Basic booking works, but advanced reassignment is EE

### 3. MANAGED
- **EE Everything:** Entire `/ee/managed-event-types/` folder ❌
- **Assessment:** Fully EE, no core equivalent

## Recommendation for cal.diy ⭐

### Keep Teams + Keep COLLECTIVE Scheduling

**Rationale:**
1. **Teams ARE core** (AGPL-licensed tRPC router exists)
2. **COLLECTIVE is simplest** (all members must be available)
3. **Booking logic exists in core** for COLLECTIVE
4. **No complex EE dependencies** for COLLECTIVE

**What to do:**
1. ✅ Keep all core team functionality (`trpc.viewer.teams.*`)
2. ✅ Remove TeamEventTypeForm (EE component)
3. ✅ Modify CreateEventTypeForm to handle teams by:
   - Adding a hidden `teamId` field when creating for teams
   - Auto-defaulting `schedulingType` to COLLECTIVE for teams
   - Remove UI choice for scheduling type
4. ❌ Remove ROUND_ROBIN (EE reassignment features)
5. ❌ Remove MANAGED (fully EE)

## Files to Modify

### 1. Remove EE Components
- Delete: `apps/web/modules/event-types/components/TeamEventTypeForm.tsx` (stub)
- Delete: `apps/web/modules/settings/teams/[id]/event-types-view.tsx` (page using it)

### 2. Modify Core Components
- **`apps/web/modules/event-types/components/CreateEventTypeDialog.tsx`**
  - Remove `teamId ? <TeamEventTypeForm> : <CreateEventTypeForm>` branching
  - Use `CreateEventTypeForm` for both personal AND team events
  - Add logic to inject `teamId` and default `schedulingType: COLLECTIVE`

### 3. Schema Changes (Optional)
- Modify validation to auto-default COLLECTIVE when `teamId` present
- Or keep validation and ensure UI always sets it

## Migration Path

1. **Phase 1:** Remove `/ee` code
   - Already done in previous commits

2. **Phase 2:** Fix team event type creation (THIS TASK)
   - Remove TeamEventTypeForm stub
   - Modify CreateEventTypeDialog to handle teams
   - Auto-default COLLECTIVE scheduling

3. **Phase 3:** Test team bookings still work
   - Verify COLLECTIVE team event types can be created
   - Verify bookings work for team events
   - Verify all team members show as busy

## Questions Answered

**Q: Are teams an EE feature?**
A: **NO!** Core team CRUD operations exist in `packages/trpc/server/routers/viewer/teams/` (AGPL-licensed)

**Q: Is team event type creation EE?**
A: **The UI is EE** (`TeamEventTypeForm` in `/ee`), but the underlying create logic is core

**Q: Can we support team scheduling without EE?**
A: **YES!** COLLECTIVE scheduling logic exists in core booking engine

**Q: What about ROUND_ROBIN?**
A: Basic booking works, but reassignment features are EE. **Recommend removing for cal.diy**

**Q: What about MANAGED?**
A: **Fully EE**, must remove

## Final Answer

✅ **Teams are CORE**  
✅ **Team event types are CORE**  
✅ **COLLECTIVE scheduling is CORE**  
❌ **TeamEventTypeForm UI is EE** (must remove/replace)  
❌ **ROUND_ROBIN reassignment is EE** (basic booking is core)  
❌ **MANAGED event types are EE** (fully remove)
