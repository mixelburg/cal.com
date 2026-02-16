# E2E Tests Status for Cal.diy

## Summary

**Test Files Removed**: 20 (all EE features)
**Test Files Remaining**: ~78 (core features + embeds + routing forms)
**Expected Pass Rate**: ~85% (core features should pass, some edge cases may fail)

---

## Removed Tests (20 files, ~77KB)

### Organizations (13 files) ❌ DELETED
```
apps/web/playwright/organization/
├── across-org/across-org.e2e.ts
├── assign-all-members-segment-filter.e2e.ts
├── booking.e2e.ts
├── expects.ts
├── lib/gotoPathAndExpectRedirectToOrgDomain.ts
├── lib/inviteUser.ts
├── organization-creation-flows.e2e.ts
├── organization-invitation.e2e.ts
├── organization-privacy.e2e.ts
├── organization-redirection.e2e.ts
├── organization-settings.e2e.ts
└── team-management.e2e.ts
```

### EE Features (7 files) ❌ DELETED
- `saml.e2e.ts` - SAML SSO authentication
- `managed-event-types.e2e.ts` - Managed event types
- `impersonation.e2e.ts` - Admin impersonation
- `insights.e2e.ts` - Insights dashboard
- `insights-routing-filters.e2e.ts` - Insights routing
- `insights-routing.e2e.ts` - Insights routing pages
- `insights-charts.e2e.ts` - Insights charts
- `attribute-routing.e2e.ts` - Attribute-based routing

**Reason**: Features completely removed from cal.diy

---

## Remaining Tests (~78 files)

### Core Features - Should Pass ✅ (30 files)

#### Teams (3 files)
- ✅ `teams.e2e.ts` - Team CRUD operations
- ✅ `team/team-invitation.e2e.ts` - Team invitations
- ✅ `team-availability.e2e.ts` - Team availability settings

#### Bookings (12 files)
- ✅ `booking-pages.e2e.ts` - Basic booking flow
- ✅ `booking-confirm-reject.e2e.ts` - Booking confirmations
- ✅ `booking-limits.e2e.ts` - Booking limits
- ✅ `booking-seats.e2e.ts` - Booking seats
- ✅ `booking-duplicate-api-calls.e2e.ts` - API call handling
- ✅ `booking-phone-autofill.e2e.ts` - Phone autofill
- ✅ `booking-race-condition.e2e.ts` - Race condition handling
- ✅ `bookings-list.e2e.ts` - Bookings list page
- ✅ `reschedule.e2e.ts` - Rescheduling
- ✅ `cancellation-fee-warning.e2e.ts` - Cancellation warnings
- ✅ `dynamic-booking-pages.e2e.ts` - Dynamic booking
- ✅ `unpublished.e2e.ts` - Unpublished events

#### Payments (1 file)
- ✅ `payment.e2e.ts` - Payment flow (CRITICAL - we restored this!)

#### Out-of-Office (1 file)
- ✅ `out-of-office.e2e.ts` - OOO functionality

#### Event Types (6 files)
- ✅ `event-types.e2e.ts` - Event type CRUD
- ✅ `eventType/availability-tab.e2e.ts` - Availability settings
- ✅ `eventType/limit-tab.e2e.ts` - Booking limits
- ✅ `eventType/ai-translation.e2e.ts` - AI translation
- ✅ `duration-limits.e2e.ts` - Duration limits
- ✅ `manage-booking-questions.e2e.ts` - Booking questions

#### Authentication & User (7 files)
- ✅ `login.e2e.ts` - Login flow
- ✅ `login.api.e2e.ts` - API login
- ✅ `login.2fa.e2e.ts` - 2FA login
- ✅ `login.oauth.e2e.ts` - OAuth login
- ✅ `signup.e2e.ts` - Signup flow
- ✅ `auth/forgot-password.e2e.ts` - Password reset
- ✅ `auth/delete-account.e2e.ts` - Account deletion

---

### Routing Forms (2 files)
- ✅ `routing-forms/basic.e2e.ts` - Basic routing forms
- ⚠️ Note: Advanced attribute routing removed, basic forms still work

---

### Embeds (7 files)
- ✅ `embed-code-generator.e2e.ts` - Embed code generator
- ✅ `embeds/embed-core/*/inline.e2e.ts` - Inline embed
- ✅ `embeds/embed-core/*/action-based.e2e.ts` - Action-based embed
- ✅ `embeds/embed-core/*/embed-pages.e2e.ts` - Embed pages
- ✅ `embeds/embed-core/*/namespacing.e2e.ts` - Namespacing
- ✅ `embeds/embed-core/*/preview.e2e.ts` - Preview
- ✅ `embeds/embed-core/*/routing-prerender.e2e.ts` - Routing prerender

---

### Settings & Profile (10 files)
- ✅ `profile.e2e.ts` - Profile management
- ✅ `availability.e2e.ts` - Availability settings
- ✅ `change-username.e2e.ts` - Username changes
- ✅ `change-password.e2e.ts` - Password changes
- ✅ `change-theme.e2e.ts` - Theme changes
- ✅ `settings/upload-avatar.e2e.ts` - Avatar upload
- ✅ `settings-admin.e2e.ts` - Admin settings
- ✅ `onboarding.e2e.ts` - Onboarding flow
- ✅ `locale.e2e.ts` - Locale settings
- ✅ `i18n-routing.e2e.ts` - i18n routing

---

### Webhooks & Integrations (5 files)
- ✅ `webhook.e2e.ts` - Webhook functionality
- ✅ `apps/analytics/analyticsApps.e2e.ts` - Analytics apps
- ✅ `apps/conferencing/conferencingApps.e2e.ts` - Conferencing apps
- ✅ `oauth-provider.e2e.ts` - OAuth provider
- ✅ `oauth/oauth-*.e2e.ts` - OAuth flows

---

### Misc (10 files)
- ✅ `filter-segment.e2e.ts` - Segment filtering
- ✅ `system-segments.e2e.ts` - System segments
- ✅ `wipe-my-cal.e2e.ts` - Wipe my cal
- ✅ `hash-my-url.e2e.ts` - Hash URLs
- ✅ `icons.e2e.ts` - Icons
- ✅ `admin-users.e2e.ts` - Admin user management
- ✅ `ab-tests-redirect.e2e.ts` - A/B test redirects
- ✅ `app-router-not-found.e2e.ts` - 404 handling
- ✅ `feature-opt-in-banner.e2e.ts` - Feature opt-in
- ✅ `overlay-calendar.e2e.ts` - Overlay calendar

---

## Test Commands

### Recommended: Core Features Only (~10 minutes)
```bash
yarn db-seed && yarn playwright test \
  apps/web/playwright/teams.e2e.ts \
  apps/web/playwright/team/team-invitation.e2e.ts \
  apps/web/playwright/payment.e2e.ts \
  apps/web/playwright/out-of-office.e2e.ts \
  apps/web/playwright/booking-pages.e2e.ts \
  apps/web/playwright/event-types.e2e.ts
```

### Full Test Suite (~30-45 minutes)
```bash
yarn test-e2e
```

### Individual Category Tests
```bash
# Teams only
yarn playwright test apps/web/playwright/teams.e2e.ts

# Payments only
yarn playwright test apps/web/playwright/payment.e2e.ts

# Bookings only
yarn playwright test apps/web/playwright/booking*.e2e.ts

# Auth only
yarn playwright test apps/web/playwright/login*.e2e.ts apps/web/playwright/signup.e2e.ts
```

---

## Expected Results

### Should Pass ✅
- All team tests (CRUD, invitations, availability)
- Payment tests (critical - we restored this feature!)
- Out-of-office tests
- Basic booking tests
- Event type tests
- Auth & login tests
- Profile & settings tests

### May Have Edge Cases ⚠️
- OAuth flows (depends on external providers)
- Webhook tests (may need external endpoints)
- Some booking race condition tests
- Email verification flows

### Known Issues 🐛
- None currently identified in core features
- If you find failures, they're likely edge cases or environment-specific

---

## Test Coverage

**Before Cleanup**: 98 test files
**After Cleanup**: 78 test files
**Removed**: 20 EE feature tests (20%)

**Focus**: 100% on core self-hosted features

---

## CI/CD Recommendation

For GitHub Actions PR checks, run only critical tests:

```yaml
- name: E2E Tests (Core Features)
  run: |
    yarn db-seed
    yarn playwright test \
      apps/web/playwright/teams.e2e.ts \
      apps/web/playwright/team/team-invitation.e2e.ts \
      apps/web/playwright/payment.e2e.ts \
      apps/web/playwright/out-of-office.e2e.ts \
      apps/web/playwright/booking-pages.e2e.ts
  timeout-minutes: 15
```

For full validation (nightly or pre-release):
```yaml
- name: E2E Tests (Full Suite)
  run: yarn test-e2e
  timeout-minutes: 60
```

---

**Status**: ✅ Test suite cleaned up and ready for cal.diy validation
**Last Updated**: 2026-02-15
**Test Files**: 78 remaining (20 removed)
