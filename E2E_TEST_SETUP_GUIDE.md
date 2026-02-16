# E2E Test Setup Guide for Cal.diy

## Prerequisites

### 1. PostgreSQL Database
You need a running PostgreSQL database. Set up in your `.env`:

```bash
DATABASE_URL="postgresql://postgres:@localhost:5450/calendso"
DATABASE_DIRECT_URL="postgresql://postgres:@localhost:5450/calendso"
```

**Quick Setup with Docker:**
```bash
docker run -d \
  --name postgres-caldiy \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=calendso \
  -p 5450:5432 \
  postgres:14
```

### 2. Environment Variables
Copy `.env.example` to `.env` and set:

```bash
# Required
NEXT_PUBLIC_WEBAPP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
CALENDSO_ENCRYPTION_KEY="your-key-here"  # Generate with: openssl rand -base64 24

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5450/calendso"
DATABASE_DIRECT_URL="postgresql://postgres:postgres@localhost:5450/calendso"

# E2E Test Flag (set automatically by test command)
NEXT_PUBLIC_IS_E2E=1
```

### 3. Install Dependencies (if not done)
```bash
yarn install
```

### 4. Run Database Migrations
```bash
yarn prisma migrate deploy
```

---

## Running E2E Tests

### Full Test Suite (All 98 tests)
```bash
# Seed database + run all tests
yarn test-e2e
```

**Warning**: This will take 30-60 minutes! Many organization tests will fail (expected).

---

## Recommended: Core Feature Tests Only

Based on our changes, here are the **critical tests** to run:

### 1. Teams Tests ⚠️ **HIGH PRIORITY**
```bash
# Core teams functionality
yarn playwright test apps/web/playwright/teams.e2e.ts

# Team invitations
yarn playwright test apps/web/playwright/team/team-invitation.e2e.ts

# Team availability
yarn playwright test apps/web/playwright/team-availability.e2e.ts
```

### 2. Payment Tests 💰 **HIGH PRIORITY**
```bash
# Payment flow (critical - we restored this!)
yarn playwright test apps/web/playwright/payment.e2e.ts
```

### 3. Out-of-Office Tests 📅 **HIGH PRIORITY**
```bash
# OOO functionality
yarn playwright test apps/web/playwright/out-of-office.e2e.ts
```

### 4. Booking Tests 📝 **MEDIUM PRIORITY**
```bash
# Basic booking flow
yarn playwright test apps/web/playwright/booking-pages.e2e.ts

# Booking confirmation
yarn playwright test apps/web/playwright/booking-confirm-reject.e2e.ts

# Reschedule
yarn playwright test apps/web/playwright/reschedule.e2e.ts
```

### 5. Event Types Tests 📋 **MEDIUM PRIORITY**
```bash
# Event type CRUD
yarn playwright test apps/web/playwright/event-types.e2e.ts
```

---

## Tests That Will FAIL (Expected) ❌

These tests cover EE features we removed - they should fail:

### Organization Tests (10+ files)
```
apps/web/playwright/organization/*.e2e.ts
```
**Removed Features**: Organizations, org hierarchy, org domains

### EE Feature Tests
```
apps/web/playwright/managed-event-types.e2e.ts      # Managed events removed
apps/web/playwright/impersonation.e2e.ts             # Impersonation removed
apps/web/playwright/insights*.e2e.ts                 # Insights dashboard removed
apps/web/playwright/saml.e2e.ts                      # SAML SSO removed
apps/web/playwright/trial.e2e.ts                     # Billing/trials removed
```

### Routing Forms Advanced Tests
```
packages/app-store/routing-forms/playwright/tests/attribute-routing.e2e.ts
```
**Reason**: Attribute-based routing is EE-only

---

## Quick Test Command

Run ONLY the core features we care about:

```bash
# Create a custom test script
yarn playwright test \
  apps/web/playwright/teams.e2e.ts \
  apps/web/playwright/team/team-invitation.e2e.ts \
  apps/web/playwright/payment.e2e.ts \
  apps/web/playwright/out-of-office.e2e.ts \
  apps/web/playwright/booking-pages.e2e.ts \
  apps/web/playwright/event-types.e2e.ts
```

Or create a test pattern:

```bash
# Run all team tests
yarn playwright test --grep "team"

# Run all payment tests
yarn playwright test --grep "payment"
```

---

## Test Workflow

### Before Running Tests:

1. **Start fresh database:**
```bash
# Reset DB
yarn prisma migrate reset --force

# Or just seed
yarn db-seed
```

2. **Build the app:**
```bash
yarn build
```

3. **Run specific tests:**
```bash
yarn playwright test <test-file-path>
```

### During Tests:

- Tests automatically start Next.js dev server on port 3000
- Tests run in headless Chrome by default
- Add `--headed` to see browser: `yarn playwright test --headed`
- Add `--debug` to debug: `yarn playwright test --debug`

### After Tests:

- Check test results in `test-results/reports/playwright-html-report/index.html`
- Failed test screenshots saved to `test-results/`

---

## Debugging Failed Tests

### View Test Report
```bash
npx playwright show-report test-results/reports/playwright-html-report
```

### Run Single Test with UI
```bash
yarn playwright test apps/web/playwright/teams.e2e.ts --headed --debug
```

### Check Screenshots
Failed tests save screenshots to `test-results/results/`

---

## Test Priority Matrix

### Must Pass ✅ (Critical for PR)
1. **teams.e2e.ts** - Core teams functionality
2. **team-invitation.e2e.ts** - Team invites (Platform API v2 dependency)
3. **payment.e2e.ts** - Paid event types (restored feature)
4. **out-of-office.e2e.ts** - OOO feature

### Should Pass ✅ (Important)
1. **booking-pages.e2e.ts** - Basic booking flow
2. **event-types.e2e.ts** - Event type CRUD
3. **reschedule.e2e.ts** - Rescheduling

### Can Fail ❌ (EE Features Removed)
1. All `organization/*.e2e.ts` tests
2. `managed-event-types.e2e.ts`
3. `impersonation.e2e.ts`
4. `insights*.e2e.ts`
5. `saml.e2e.ts`
6. `attribute-routing.e2e.ts`

---

## Estimated Time

- **Full suite** (98 tests): 30-60 minutes
- **Core features only** (6 tests): 5-10 minutes
- **Single test**: 30-120 seconds

---

## CI/CD Integration

For GitHub Actions, the test command is:
```yaml
- name: Run E2E Tests
  run: |
    yarn db-seed
    yarn playwright test \
      apps/web/playwright/teams.e2e.ts \
      apps/web/playwright/team/team-invitation.e2e.ts \
      apps/web/playwright/payment.e2e.ts \
      apps/web/playwright/out-of-office.e2e.ts
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

---

## What to Provide

Please set up:

1. ✅ **PostgreSQL database** (running on localhost:5450 or update DATABASE_URL)
2. ✅ **`.env` file** with required variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)
3. ✅ **Run migrations**: `yarn prisma migrate deploy`
4. ✅ **Confirm server can start**: `yarn dev` (test manually)

Then I can run:
```bash
yarn db-seed && yarn playwright test apps/web/playwright/teams.e2e.ts
```

Let me know when the database is ready and I'll run the critical tests! 🚀
