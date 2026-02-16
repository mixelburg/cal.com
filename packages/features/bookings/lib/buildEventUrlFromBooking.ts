import { WEBSITE_URL } from "@calcom/lib/constants";
import logger from "@calcom/lib/logger";
import { safeStringify } from "@calcom/lib/safeStringify";

type BookingEventType = {
  slug: string;
  team: {
    slug: string | null;
    parentId: number | null;
  } | null;
};

/**
 * It has its profile always set and if organizationId is null, then username would be regular(non-org) username.
 */
type ProfileEnrichedBookingUser = {
  profile: { organizationId: number | null; username: string | null };
} | null;

// Organizations removed - getOrganizationIdOfBooking no longer needed

export async function buildEventUrlFromBooking(booking: {
  eventType: BookingEventType;
  profileEnrichedBookingUser: ProfileEnrichedBookingUser;
  dynamicGroupSlugRef: string | null;
}) {
  const { eventType, dynamicGroupSlugRef, profileEnrichedBookingUser } = booking;
  const eventSlug = eventType.slug;
  const eventTeam = eventType.team;
  const bookerUrl = WEBSITE_URL;
  if (dynamicGroupSlugRef) {
    return `${bookerUrl}/${dynamicGroupSlugRef}/${eventSlug}`;
  }

  if (eventTeam?.slug) {
    return `${bookerUrl}/team/${eventTeam.slug}/${eventSlug}`;
  }

  const username = profileEnrichedBookingUser?.profile?.username;
  if (!username) {
    logger.error("No username found for booking user.", safeStringify({ profileEnrichedBookingUser }));
    throw new Error("No username found for booking user.");
  }
  return `${bookerUrl}/${username}/${eventSlug}`;
}
