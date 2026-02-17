import { expect } from "@playwright/test";

import { SchedulingType } from "@calcom/prisma/enums";

import { test } from "./lib/fixtures";

// Keep parallel mode - each test creates its own isolated data
test.describe.configure({ mode: "parallel" });

const title = (name: string) => `${name} is unpublished`;
const description = (entity: string) =>
  `This ${entity} link is currently not available. Please contact the ${entity} owner or ask them to publish it.`;

const assertChecks = async (page: any, entityName: string, entityType: string) => {
  await expect(page.locator('[data-testid="empty-screen"]')).toHaveCount(1);
  await expect(page.locator(`h2:has-text("${title(entityName)}")`)).toHaveCount(1);
  await expect(page.locator(`div:text("${description(entityType)}")`)).toHaveCount(1);
  await expect(page.locator(`img`)).toHaveAttribute("src", /.*/);
};

// Group 1: Regular team tests - share setup data
test.describe("Unpublished - Regular team", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("Regular team profile", async ({ page, users }) => {
    const owner = await users.create(undefined, {
      hasTeam: true,
      isUnpublished: true,
      schedulingType: SchedulingType.COLLECTIVE,
    });
    const { team } = await owner.getFirstTeamMembership();
    const { requestedSlug } = team.metadata as { requestedSlug: string };
    const teamEventSlug = (await owner.getFirstTeamEvent(team.id)).slug;
    const prefixes = ["", "/en"];

    // Test team profile
    for (const prefix of prefixes) {
      await page.goto(`${prefix}/team/${requestedSlug}`);
      await assertChecks(page, team.name, "team");
    }

    // Test team event type (reuse same data)
    for (const prefix of prefixes) {
      await page.goto(`${prefix}/team/${requestedSlug}/${teamEventSlug}`);
      await assertChecks(page, team.name, "team");
    }
  });
});

