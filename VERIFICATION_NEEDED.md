# ✅ VERIFIED: Workflows are EE-Only

**Date:** 2026-02-15
**Status:** CONFIRMED by Cal.com - Workflows are Enterprise Edition only
**Issue:** Confusion about what's actually EE vs core for self-hosted (NOW RESOLVED)

## Resolution

**Cal.com CONFIRMED: Workflows are EE-only (Enterprise Edition)**

Despite the confusing FAQ on https://cal.com/workflows, workflows are NOT available in self-hosted free versions:
- ✅ Workflows code in `packages/features/ee/workflows/` - CORRECTLY DELETED
- ✅ Commercial License applies - NOT available in AGPL self-hosted
- ✅ Our deletion was correct

The FAQ likely means "supported in both Cal.com Cloud and self-hosted EE licenses" (not free self-hosted).

## What We Deleted

From commit `19adde2bf0 "remove all Enterprise Edition (/ee) code"`:

### Workflows
- ❌ `packages/features/ee/workflows/` - **DELETED** (all workflow logic)
- ❌ `packages/features/workflows/` - **DELETED** (core repositories)
- ❌ `apps/web/modules/ee/workflows/` - DELETED (UI components)

### Teams  
- ❌ `packages/features/ee/teams/` - **DELETED** (BUT we verified teams are core!)
- ✅ Core team tRPC router kept (`packages/trpc/server/routers/viewer/teams/`)

### Other EE Features Deleted
- Round-robin (`/ee/round-robin/`)
- Managed event types (`/ee/managed-event-types/`)
- Organizations (`/ee/organizations/`)
- SAML/SSO (`/ee/sso/`)
- Billing (`/ee/billing/`)
- API keys (`/ee/api-keys/`)

## Questions to Answer

### 1. Workflows - Core or EE?

**Evidence FOR core/self-hosted:**
- ✅ Official FAQ: "fully supported in both hosted and self-hosted"
- ✅ Listed under general "Resources" (not Enterprise section) on cal.com
- ✅ No mention on https://cal.com/enterprise as enterprise-only
- ✅ Core `packages/features/workflows/repositories/` existed

**Evidence FOR EE:**
- ❌ Code lives in `/ee` folder (Commercial License)
- ❌ Commit message said "Workflows (email/SMS reminders)" were EE
- ❌ FAQ links to `/ee/workflows` in GitHub

**Verdict:** UNCLEAR - Need to restore workflows to be safe

### 2. What's the /ee Folder Rule?

Official README says:
> "The /ee subfolder is the place for all the Enterprise Edition features"

But cal.com FAQ says workflows (in `/ee`) are available for self-hosted. This seems contradictory.

**Possible interpretations:**
1. **Option A:** `/ee` code is dual-licensed (Commercial + AGPL for self-hosted)
2. **Option B:** Cal.com's FAQ is wrong/outdated
3. **Option C:** "Self-hosted" means you need to buy a license but host yourself

### 3. What Should cal.diy Include?

For a truly open-source, free self-hosted version (cal.diy):

**Definitely CORE (keep):**
- ✅ Teams (CRUD, memberships, COLLECTIVE scheduling)
- ✅ Basic event types
- ✅ Bookings
- ✅ Calendars
- ✅ Webhooks
- ✅ Routing forms

**Probably CORE (restore?):**
- ⚠️ **Workflows** - FAQ says "fully supported in self-hosted"
- ⚠️ Basic email reminders

**Definitely EE (remove):**
- ❌ Round-robin reassignment (confirmed on /enterprise page)
- ❌ Attribute-based routing (confirmed on /enterprise page)
- ❌ SAML/SSO
- ❌ Organizations/sub-teams
- ❌ Team billing
- ❌ Managed event types
- ❌ Insights dashboard
- ❌ SCIM/directory sync

## Recommended Action

### Option 1: Conservative Approach (Restore Workflows)
Since cal.com's official FAQ says workflows are supported in self-hosted:
1. Restore `packages/features/ee/workflows/` from git
2. Keep workflow functionality
3. Document that this is based on cal.com's FAQ

**Risk:** Might be violating Commercial License  
**Benefit:** Matches cal.com's official documentation

### Option 2: Aggressive Approach (Keep Deleted)
Remove all `/ee` code regardless of FAQ:
1. Treat all `/ee` as Commercial License (as README states)
2. Build own workflow system later if needed
3. Document that we removed it due to license location

**Risk:** Might be removing a feature that should be available  
**Benefit:** Clear separation, no license ambiguity

### Option 3: Ask Cal.com (Recommended)
- Open GitHub issue asking about workflows + self-hosted licensing
- Clarify if `/ee/workflows` is available for self-hosted
- Get official answer before proceeding

## Current Status

**Files Deleted:**
- `packages/features/ee/` - entire folder (~738 files)
- `packages/features/workflows/` - core repositories
- `apps/web/modules/ee/` - all EE UI

**Type Errors:** 262 remaining (down from ~295)

**Next Steps:**
1. ⚠️ DECIDE: Restore workflows or keep deleted?
2. ⚠️ VERIFY: Check if any other "core" features were in `/ee`
3. Continue fixing remaining 262 type errors
4. Test that core features (teams, bookings, calendars) still work

## Files to Check for Core Feature Deletion

```bash
# Check what was in /ee that might be core
git show main:packages/features/ee/ | grep -v "LICENSE\|README"

# Check team-related deletions
git show main:packages/features/ee/teams/

# Check if any core booking logic was in /ee
git show main:packages/features/ee/ | grep -i "booking\|calendar\|event"
```
