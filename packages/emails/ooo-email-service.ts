// OOO Email Service (core feature)
// Extracted from workflow-email-service to support Out of Office feature

import type BaseEmail from "@calcom/emails/templates/_base-email";

import type { IBookingRedirect } from "./templates/booking-redirect-notification";
import BookingRedirectEmailNotification from "./templates/booking-redirect-notification";

const sendEmail = (prepare: () => BaseEmail) => {
  return new Promise((resolve, reject) => {
    try {
      const email = prepare();
      resolve(email.sendEmail());
    } catch (e) {
      reject(console.error(`${prepare.constructor.name}.sendEmail failed`, e));
    }
  });
};

export const sendBookingRedirectNotification = async (bookingRedirect: IBookingRedirect) => {
  await sendEmail(() => new BookingRedirectEmailNotification(bookingRedirect));
};
