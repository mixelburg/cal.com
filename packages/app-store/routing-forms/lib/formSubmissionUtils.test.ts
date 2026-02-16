/**
 * @vitest-environment node
 */
import "@calcom/lib/__mocks__/logger";
import { prisma } from "@calcom/prisma/__mocks__/prisma";

import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import type { WebhookSubscriber } from "@calcom/features/webhooks/lib/dto/types";
import getWebhooks from "@calcom/features/webhooks/lib/getWebhooks";
import { sendGenericWebhookPayload } from "@calcom/features/webhooks/lib/sendPayload";
import { WebhookTriggerEvents } from "@calcom/prisma/enums";
import { WebhookVersion as WebhookVersionEnum } from "@calcom/features/webhooks/lib/interface/IWebhookRepository";

import type { FormResponse, Field } from "../types/types";
import { _onFormSubmission } from "./formSubmissionUtils";

vi.mock("@calcom/prisma", () => ({
  prisma,
}));

// Mock dependencies
vi.mock("@calcom/lib/getOrgIdFromMemberOrTeamId", () => ({
  default: vi.fn(() => Promise.resolve(1)),
}));
vi.mock("@calcom/features/webhooks/lib/getWebhooks", () => ({
  default: vi.fn(() => Promise.resolve([])),
}));
vi.mock("@calcom/features/webhooks/lib/sendPayload", () => ({
  sendGenericWebhookPayload: vi.fn(() => Promise.resolve()),
}));
vi.mock("@calcom/features/tasker", () => {
  const tasker = {
    create: vi.fn(() => Promise.resolve()),
  };
  return { default: Promise.resolve(tasker) };
});

const mockSendEmail = vi.fn(() => Promise.resolve());
const mockResponseEmailConstructor = vi.fn();
vi.mock("../emails/templates/response-email", () => ({
  default: class MockResponseEmail {
    sendEmail = mockSendEmail;
    constructor(...args: unknown[]) {
      mockResponseEmailConstructor(...args);
    }
  },
}));

describe("_onFormSubmission", () => {
  const mockForm = {
    id: "form-1",
    name: "Test Form",
    disabled: false,
    userId: 1,
    position: 0,
    description: null,
    updatedById: null,
    fields: [
      { id: "field-1", identifier: "email", label: "Email", type: "email", required: false },
      { id: "field-2", identifier: "name", label: "Name", type: "text", required: false },
    ] as Field[],
    user: { id: 1, email: "test@example.com", timeFormat: 12, locale: "en" },
    teamId: null,
    settings: { emailOwnerOnSubmission: true },
    routes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    connectedForms: [],
    routers: [],
    teamMembers: [],
  };

  const mockResponse: FormResponse = {
    "field-1": { label: "Email", value: "test@response.com" },
    "field-2": { label: "Name", value: "Test Name" },
  };

  const responseId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Webhooks", () => {
    it("should call FORM_SUBMITTED webhooks", async () => {
      const mockWebhook: WebhookSubscriber = {
        id: "wh-1",
        secret: "secret",
        subscriberUrl: "https://example.com/webhook",
        payloadTemplate: null,
        appId: null,
        eventTriggers: [WebhookTriggerEvents.FORM_SUBMITTED],
        time: null,
        timeUnit: null,
        version: WebhookVersionEnum.V_2021_10_20,
      };
      vi.mocked(getWebhooks).mockResolvedValueOnce([mockWebhook]);

      await _onFormSubmission(mockForm, mockResponse, responseId);

      expect(getWebhooks).toHaveBeenCalledWith({
        userId: 1,
        teamId: null,
        orgId: 1,
        triggerEvent: WebhookTriggerEvents.FORM_SUBMITTED,
      });
      expect(sendGenericWebhookPayload).toHaveBeenCalledTimes(1);
    });

    it("should normalize identifiers with spaces to hyphens in rootData for webhook templates", async () => {
      const formWithSpaces = {
        ...mockForm,
        fields: [
          {
            id: "field-1",
            identifier: "attendee name",
            label: "Attendee Name",
            type: "text",
            required: false,
          },
        ] as Field[],
      };

      const responseWithSpaces: FormResponse = {
        "field-1": { label: "Attendee Name", value: "John Doe" },
      };

      const mockWebhook: WebhookSubscriber = {
        id: "wh-1",
        secret: "secret",
        subscriberUrl: "https://example.com/webhook",
        payloadTemplate: null,
        appId: null,
        eventTriggers: [WebhookTriggerEvents.FORM_SUBMITTED],
        time: null,
        timeUnit: null,
        version: WebhookVersionEnum.V_2021_10_20,
      };
      vi.mocked(getWebhooks).mockResolvedValueOnce([mockWebhook]);

      await _onFormSubmission(formWithSpaces, responseWithSpaces, responseId);

      expect(sendGenericWebhookPayload).toHaveBeenCalledWith(
        expect.objectContaining({
          rootData: expect.objectContaining({
            "attendee-name": "John Doe", // Spaces replaced with hyphens for template access
          }),
        })
      );
    });
  });

  // Workflows removed (EE feature) - test suite removed

  describe("Response Email", () => {
    it("should send response email to team members for a team form", async () => {
      const teamForm = {
        ...mockForm,
        teamId: 1,
        userWithEmails: ["team-member1@example.com", "team-member2@example.com"],
        user: { id: 1, email: "test@example.com", timeFormat: 12, locale: "en" },
      };

      await _onFormSubmission(teamForm, mockResponse, responseId);

      expect(mockResponseEmailConstructor).toHaveBeenCalledWith({
        form: teamForm,
        toAddresses: ["team-member1@example.com", "team-member2@example.com"],
        orderedResponses: [mockResponse["field-1"], mockResponse["field-2"]],
      });
      expect(mockSendEmail).toHaveBeenCalled();
    });

    it("should send response email to owner when enabled", async () => {
      const ownerForm = {
        ...mockForm,
        settings: { emailOwnerOnSubmission: true },
      };

      await _onFormSubmission(ownerForm, mockResponse, responseId);

      expect(mockResponseEmailConstructor).toHaveBeenCalledWith({
        form: ownerForm,
        toAddresses: [ownerForm.user.email],
        orderedResponses: [mockResponse["field-1"], mockResponse["field-2"]],
      });
      expect(mockSendEmail).toHaveBeenCalled();
    });

    it("should not send response email to owner when disabled", async () => {
      const ownerForm = {
        ...mockForm,
        settings: { emailOwnerOnSubmission: false },
      };

      await _onFormSubmission(ownerForm, mockResponse, responseId);

      expect(mockResponseEmailConstructor).not.toHaveBeenCalled();
      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });
});
