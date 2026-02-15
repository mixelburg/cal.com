import { prisma } from "@calcom/prisma";

import { getPublicEventSelect } from "./getPublicEvent";

export async function getTeamEventType(teamSlug: string, meetingSlug: string, _orgSlug: string | null) {
  // Organization support removed (EE feature)
  return await prisma.eventType.findFirst({
    where: {
      team: {
        slug: teamSlug,
        parent: null, // Organizations removed
      },
      OR: [{ slug: meetingSlug }, { slug: { startsWith: `${meetingSlug}-team-id-` } }],
    },
    // IMPORTANT:
    // This ensures that the queried event type has everything expected in Booker
    select: getPublicEventSelect(false),
    orderBy: {
      slug: "asc",
    },
  });
}
