# Critical Self-Assessment: Mistakes Made During EE Removal

## Overview
**Total commits in branch**: 534 (ahead of private/main)
**Files deleted**: 1,459 files
**"Fix/Restore" commits identified**: Analyzing...

---

## CRITICAL MISTAKES - Core Features Mistakenly Removed

### 1. ❌ **API Keys Backend** (Partially Fixed: commit e4527d81ed, MORE ISSUES FOUND)
**What I did wrong:**
- Deleted `generateUniqueAPIKey()` function thinking entire feature was EE
- Created broken stubs in MULTIPLE locations:
  - `apps/api/v1/pages/api/api-keys/_post.ts` - Stub `["", ""]` ✅ FIXED
  - `packages/trpc/server/routers/viewer/apiKeys/create.handler.ts` - Stub `["hashed-key", "api-key"]` ❌ **STILL BROKEN**
  - `packages/trpc/server/routers/viewer/apiKeys/list.handler.ts` - Stub returns `[]` ❌ **STILL BROKEN**
- Did NOT check if backend had license gates vs UI only
- Did NOT search for ALL usages before stubbing

**What was actually true:**
- ✅ Backend API = Core feature (no license check, documented for self-hosted)
- ❌ UI = EE only (had `LicenseRequired` wrapper)

**Impact:** 
- ✅ API v1 `/api/api-keys` endpoint - Fixed
- ❌ tRPC `apiKeys.create` - Returns hardcoded strings, not secure hashes - **STILL BROKEN**
- ❌ tRPC `apiKeys.list` - Returns empty array even if keys exist - **STILL BROKEN**

**Root cause:** 
1. Assumed entire feature was EE based on UI folder location
2. Created stubs in multiple places without restoring original once
3. Did NOT use `rg` to find ALL imports before stubbing

---

### 2. ❌ **Paid Event Types** (Fixed: commit 8b42804755)
**What I did wrong:**
- Stubbed payment handlers (`payment.tsx`, `getClientSecretFromPayment.ts`)
- Created empty stubs in payment components (Alby, BTCPay, PayPal, HitPay)
- Did NOT verify if payments worked without Stripe

**What was actually true:**
- ✅ Paid events = Core feature (supports Alby, BTCPay, PayPal, HitPay - not just Stripe)
- ❌ Only Stripe billing subscriptions = EE

**Impact:** Would have completely broken paid event types (critical revenue feature)

**Root cause:** Assumed "payment" = Stripe = EE billing

---

### 3. ❌ **TeamService** (Fixed: commit 23a5c43f84)
**What I did wrong:**
- Deleted entire `TeamService.ts` file
- Platform API v2 broke completely (imported from `@calcom/platform-libraries`)
- Only fixed after user explicitly warned about breaking millions of users

**What was actually true:**
- ✅ Core team operations = Core (CRUD, members, invites)
- ❌ Team billing, subscriptions, workflows = EE

**Impact:** Would have broken Platform API v2 and all team operations

**Root cause:** Saw file in `/ee/` folder and deleted without checking usage or license gates

---

### 4. ❌ **TeamRepository** (Fixed: commits 82c8b8e85d, af0c3194e6)
**What I did wrong:**
- Created stub class returning null/empty arrays
- Used in 6+ handler files (team updates, invites, billing checks)
- Did NOT restore original and surgically remove EE parts

**What was actually true:**
- ✅ Core lookups (findById, findBySlug, team parent lookup) = Core
- ❌ Organization hierarchy queries = EE

**Impact:** No-show fees, team lookups, invitations would all fail

**Root cause:** Created stub from scratch instead of adapting original

---

### 5. ❌ **getTeamData** (Fixed: commit 0c7e1834f1)
**What I did wrong:**
- Deleted function completely
- Team booking pages broke
- Created simple stub later without checking original implementation

**What was actually true:**
- ✅ Basic team data lookup = Core (needed for all team bookings)
- ❌ Organization features within it = EE

**Impact:** All team booking pages would crash

**Root cause:** Overly aggressive deletion without checking call sites

---

## PATTERN OF MISTAKES

### Mistake Pattern #1: "Location = Purpose" Fallacy
**My wrong assumption:** "If file is in `/ee/` folder → entire feature is EE"

**Reality:**
- `/ee/` folder contains BOTH:
  - Core infrastructure used by everyone
  - EE-only features gated by license checks
- Must check for `LicenseRequired`, billing checks, or feature flags

**Examples:**
- `/ee/api-keys/` - Backend is core, UI is EE
- `/ee/teams/` - Basic CRUD is core, billing/orgs/workflows are EE
- `/ee/payments/` - Non-Stripe providers are core, Stripe subscriptions are EE

---

### Mistake Pattern #2: "Stub Instead of Adapt"
**What I did wrong:** Created new stub functions from scratch

**What I should have done:**
1. `git show main:path/to/file.ts` - Get original
2. Identify EE-specific code (license checks, billing, workflows)
3. Surgically remove only EE parts
4. Keep core logic intact

**Examples where I failed:**
- `TeamRepository` - Created stub class → should have restored and removed org queries
- `generateUniqueAPIKey` - Created `return ["", ""]` → should have restored crypto implementation
- `TeamService` - Deleted entirely → should have restored and removed billing/workflows

---

### Mistake Pattern #3: "Assumption Over Verification"
**What I did wrong:** Assumed feature categorization without checking:
- License/billing gates in code
- Documentation (official docs, self-hosted guides)
- Git history (`git log`, `git blame`)
- Usage/imports across codebase

**Examples:**
- API keys - Assumed entire feature EE without checking docs
- Payments - Assumed all payments = Stripe = EE
- Teams - Assumed all team code = EE because in `/ee/teams/`

---

### Mistake Pattern #4: "Write Instead of Restore"
**What I did wrong:** When I discovered mistakes, I wrote new code from scratch

**Why this is bad:**
- Makes diff huge and hard to review
- Loses original structure/patterns
- Introduces new bugs
- Risky for production (millions of users)

**User's correct guidance:**
> "writing code from scratch ruins the organization and it makes it really difficult to review and it's risky. you should take an approach of restoring files if you deleted accidentally and then adapt them"

---

## ASSESSMENT SCALE

### Severity of Mistakes:
1. **🔴 CRITICAL** - Would break core functionality (Payments, Teams API, API keys)
2. **🟡 MODERATE** - Would cause degraded experience but not complete breakage
3. **🟢 MINOR** - Cosmetic or non-essential features

### My Mistakes Breakdown:
- 🔴 **CRITICAL**: 5 mistakes (API keys, Payments, TeamService, TeamRepository, getTeamData)
- 🟡 **MODERATE**: Unknown (need deeper analysis)
- 🟢 **MINOR**: Unknown (need deeper analysis)

---

## ROOT CAUSES ANALYSIS

### 1. **Lack of Systematic Verification**
- Did NOT check official docs before removing features
- Did NOT search for `LicenseRequired` or billing gates
- Did NOT verify with `git show main:` before deleting

### 2. **Overly Aggressive Deletion**
- Deleted entire folders/files without granular analysis
- Assumed folder location = feature classification
- Did NOT check call sites or usage patterns

### 3. **Writing Instead of Adapting**
- Created stubs from scratch instead of restoring originals
- Lost original patterns and structure
- Made review much harder

### 4. **Insufficient Testing Mindset**
- Did NOT think "what would break if I remove this?"
- Did NOT trace dependencies before deletion
- Did NOT verify against self-hosted documentation

---

## CORRECTIVE ACTIONS MOVING FORWARD

### ✅ **MUST DO Before Removing Any Code:**

1. **Verification Checklist:**
   ```bash
   # Step 1: Check for license gates
   git show main:path/to/file.ts | grep -i "license\|hasPaidPlan\|billing"
   
   # Step 2: Check official docs
   # Search cal.com docs for feature in self-hosted context
   
   # Step 3: Check usage
   rg "import.*from.*path/to/feature" packages/ apps/
   
   # Step 4: Check git history
   git log --oneline -- path/to/file.ts | head -20
   ```

2. **Adaptation Process:**
   ```bash
   # Step 1: Restore original
   git show main:path/to/file.ts > /tmp/original.ts
   
   # Step 2: Read and understand
   # Identify: What's core? What's EE? What are the boundaries?
   
   # Step 3: Surgically remove EE parts only
   # Keep: Core logic, type safety, error handling
   # Remove: License checks, billing calls, org features
   ```

3. **Never:**
   - ❌ Delete files based on folder location alone
   - ❌ Create stubs from scratch
   - ❌ Assume without verification
   - ❌ Write new implementations

4. **Always:**
   - ✅ Restore from main first
   - ✅ Verify with docs and git history
   - ✅ Check for license gates
   - ✅ Adapt existing code, don't rewrite

---

## CONTINUING ASSESSMENT

### Next Steps:
1. Search for ALL remaining stubs with `git grep "Stub for"`
2. For each stub:
   - Get original from main
   - Check if it was core functionality
   - If core: Restore and adapt
   - If EE: Keep stub but improve comment
3. Document any additional mistakes found
4. Create final summary before PR

---

**Status**: Assessment in progress
**Date**: 2026-02-16
**Commits analyzed**: ~50 of 534 (need to analyze all "fix" and "restore" commits)
