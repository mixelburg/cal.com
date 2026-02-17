import AttendeeAddGuestsEmail from "@calcom/emails/templates/attendee-add-guests-email";
import AttendeeCancelledEmail from "@calcom/emails/templates/attendee-cancelled-email";
import AttendeeDeclinedEmail from "@calcom/emails/templates/attendee-declined-email";
import AttendeeRequestEmail from "@calcom/emails/templates/attendee-request-email";
import AttendeeRescheduledEmail from "@calcom/emails/templates/attendee-rescheduled-email";
import AttendeeScheduledEmail from "@calcom/emails/templates/attendee-scheduled-email";
import AttendeeUpdatedEmail from "@calcom/emails/templates/attendee-updated-email";
import AttendeeVerifyEmail from "@calcom/emails/templates/attendee-verify-email";
import OrganizerAddGuestsEmail from "@calcom/emails/templates/organizer-add-guests-email";
import OrganizerCancelledEmail from "@calcom/emails/templates/organizer-cancelled-email";
import OrganizerReassignedEmail from "@calcom/emails/templates/organizer-reassigned-email";
import OrganizerRequestEmail from "@calcom/emails/templates/organizer-request-email";
import OrganizerRescheduledEmail from "@calcom/emails/templates/organizer-rescheduled-email";
import OrganizerScheduledEmail from "@calcom/emails/templates/organizer-scheduled-email";
import {
  sendChangeOfEmailVerification,
  sendEmailVerificationByCode,
} from "@calcom/features/auth/lib/verifyEmail";
import { verifyCodeUnAuthenticated } from "@calcom/features/auth/lib/verifyCodeUnAuthenticated";
import { sendSignupToOrganizationEmail } from "@calcom/trpc/server/routers/viewer/teams/inviteMember/utils";

export { AttendeeVerifyEmail };

export { AttendeeAddGuestsEmail };

export { OrganizerAddGuestsEmail };

export { AttendeeScheduledEmail };

export { OrganizerScheduledEmail };

export { AttendeeDeclinedEmail };

export { AttendeeCancelledEmail };

export { OrganizerCancelledEmail };

export { OrganizerReassignedEmail };

export { OrganizerRescheduledEmail };

export { AttendeeRescheduledEmail };

export { AttendeeUpdatedEmail };

export { OrganizerRequestEmail };

export { AttendeeRequestEmail };

export { sendSignupToOrganizationEmail };

export { sendEmailVerificationByCode };
export { sendChangeOfEmailVerification };

export async function verifyEmailCodeHandler({
  input,
}: {
  input: { email: string; code: string; teamId?: number };
}) {
  return verifyCodeUnAuthenticated(input.email, input.code);
}
