import { constantsScenarios } from "@calcom/lib/__mocks__/constants";

import { describe, it, vi, expect, beforeEach } from "vitest";

import { buildEventUrlFromBooking } from "./buildEventUrlFromBooking";

const BASE_URL = "https://buildEventTest.example";
beforeEach(() => {
  constantsScenarios.setWebsiteUrl(BASE_URL);
  constantsScenarios.set({ WEBAPP_URL: BASE_URL });
});

describe("buildEventUrlFromBooking", () => {
  describe("Non Organization", () => {
    it("should correctly build the event URL for a team event booking", async () => {
      const booking = {
        eventType: {
          slug: "30min",
          team: {
            slug: "engineering",
            parentId: 123,
          },
        },
        profileEnrichedBookingUser: {
          profile: {
            organizationId: null,
            username: "john",
          },
        },
        dynamicGroupSlugRef: null,
      };
      const expectedUrl = `${BASE_URL}/team/engineering/30min`;
      const result = await buildEventUrlFromBooking(booking);
      expect(result).toBe(expectedUrl);
    });

    it("should correctly build the event URL for a dynamic group booking", async () => {
      const booking = {
        eventType: {
          slug: "30min",
          team: null,
        },
        profileEnrichedBookingUser: {
          profile: {
            organizationId: null,
            username: "john",
          },
        },
        dynamicGroupSlugRef: "john+jane",
      };
      const expectedUrl = `${BASE_URL}/john+jane/30min`;
      const result = await buildEventUrlFromBooking(booking);
      expect(result).toBe(expectedUrl);
    });

    it("should correctly build the event URL for a personal booking", async () => {
      const booking = {
        eventType: {
          slug: "30min",
          team: null,
        },
        profileEnrichedBookingUser: {
          profile: {
            organizationId: null,
            username: "john",
          },
        },
        dynamicGroupSlugRef: null,
      };
      const expectedUrl = `${BASE_URL}/john/30min`;
      const result = await buildEventUrlFromBooking(booking);
      expect(result).toBe(expectedUrl);
    });
  });

  it("should throw if the username isn't set", async () => {
    const booking = {
      eventType: {
        slug: "30min",
        team: null,
      },
      profileEnrichedBookingUser: {
        profile: {
          organizationId: null,
          username: null,
        },
      },
      dynamicGroupSlugRef: null,
    };
    await expect(() => buildEventUrlFromBooking(booking)).rejects.toThrow(
      "No username found for booking user."
    );
  });
});
