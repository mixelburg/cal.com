/**
 * @vitest-environment jsdom
 */
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import type { BookerEvent } from "@calcom/features/bookings/types";

import { useInitialFormValues } from "./useInitialFormValues";

vi.mock("@calcom/features/bookings/Booker/store", () => ({
  useBookerStore: vi.fn((selector) => {
    const state = {
      bookingData: null,
      formValues: {},
    };
    return selector(state);
  }),
}));

vi.mock("@calcom/features/bookings/lib/getBookingResponsesSchema", () => ({
  getBookingResponsesPartialSchema: vi.fn(() => ({
    parseAsync: vi.fn((data) => Promise.resolve(data)),
  })),
}));

describe("useInitialFormValues - Autofill Disable Feature", () => {
  const mockBookingFields = [
    { name: "name", type: "text" as const, required: true },
    { name: "email", type: "email" as const, required: true },
    { name: "phone", type: "phone" as const, required: false },
  ] as unknown as BookerEvent["bookingFields"];

  const baseProps = {
    rescheduleUid: null,
    isRescheduling: false,
    email: null,
    name: null,
    username: null,
    hasSession: false,
    extraOptions: {},
    prefillFormParams: {
      guests: [],
      name: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("when organization has NOT disabled autofill", () => {
    it("should use URL parameters to prefill form fields", async () => {
      const eventType: Pick<BookerEvent, "bookingFields" | "team" | "owner"> = {
        bookingFields: mockBookingFields,
        team: {
          organizationSettings: {
            disableAutofillOnBookingPage: false,
          },
        },
        owner: null,
      };

      const extraOptions = {
        phone: "+1234567890",
        customField: "custom value",
      };

      const prefillFormParams = {
        guests: ["guest1@example.com", "guest2@example.com"],
        name: "John Doe",
      };

      const { result } = renderHook(() =>
        useInitialFormValues({
          ...baseProps,
          eventType,
          extraOptions,
          prefillFormParams,
        })
      );

      await waitFor(() => {
        expect(result.current.values.responses).toBeDefined();
      });

      expect(result.current.values.responses).toMatchObject({
        name: "John Doe",
        phone: "+1234567890",
      });
    });

    it("should use URL parameters when organizationSettings is undefined", async () => {
      const eventType: Pick<BookerEvent, "bookingFields" | "team" | "owner"> = {
        bookingFields: mockBookingFields,
        team: null,
        owner: null,
      };

      const extraOptions = {
        phone: "+1234567890",
      };

      const prefillFormParams = {
        guests: [],
        name: "Jane Smith",
      };

      const { result } = renderHook(() =>
        useInitialFormValues({
          ...baseProps,
          eventType,
          extraOptions,
          prefillFormParams,
        })
      );

      await waitFor(() => {
        expect(result.current.values.responses).toBeDefined();
      });

      expect(result.current.values.responses).toMatchObject({
        name: "Jane Smith",
        phone: "+1234567890",
      });
    });
  });

  describe("autofill always enabled in cal.diy (organizations removed)", () => {
    it("should use URL parameters even when team.parent.organizationSettings.disableAutofillOnBookingPage was true", async () => {
      const eventType: Pick<BookerEvent, "bookingFields" | "team" | "owner"> = {
        bookingFields: mockBookingFields,
        team: {
          parent: {
            organizationSettings: {
              disableAutofillOnBookingPage: true,
            },
          },
        },
        owner: null,
      };

      const extraOptions = {
        phone: "+1234567890",
        customField: "custom value",
      };

      const prefillFormParams = {
        guests: ["guest1@example.com"],
        name: "John Doe",
      };

      const { result } = renderHook(() =>
        useInitialFormValues({
          ...baseProps,
          eventType,
          extraOptions,
          prefillFormParams,
        })
      );

      await waitFor(() => {
        expect(result.current.values.responses).toBeDefined();
      });

      expect(result.current.values.responses).toMatchObject({
        name: "John Doe",
        phone: "+1234567890",
      });
    });

    it("should use session email/name since autofill cannot be disabled without orgs", async () => {
      const eventType: Pick<BookerEvent, "bookingFields" | "team" | "owner"> = {
        bookingFields: mockBookingFields,
        team: {
          parent: {
            organizationSettings: {
              disableAutofillOnBookingPage: true,
            },
          },
        },
        owner: null,
      };

      const extraOptions = {
        phone: "+1234567890",
      };

      const { result } = renderHook(() =>
        useInitialFormValues({
          ...baseProps,
          eventType,
          extraOptions,
          email: "session@example.com",
          name: "Session User",
          hasSession: true,
        })
      );

      await waitFor(() => {
        expect(result.current.values.responses).toBeDefined();
      });

      expect(result.current.values.responses?.email).toBe("session@example.com");
      expect(result.current.values.responses?.name).toBe("Session User");
      expect(result.current.values.responses?.phone).toBe("+1234567890");
    });
  });
});
