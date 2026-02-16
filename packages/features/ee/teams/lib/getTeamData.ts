import { getSlugOrRequestedSlug } from "@calcom/features/ee/organizations/lib/orgDomains";
import { prisma } from "@calcom/prisma";

export type TeamData = Awaited<ReturnType<typeof getTeamData>>;

/**
 * Organizations removed - fetches team data without parent org context
 * For self-hosted: teams exist but don't have organization parents
 */
export async function getTeamData(teamSlug: string, orgSlug: string | null) {
  // For self-hosted, orgSlug is always null - fetch team directly by slug
  return await prisma.team.findFirst({
    where: {
      ...getSlugOrRequestedSlug(teamSlug),
      // Organizations removed - no parent org filtering
      parentId: null,
    },
    orderBy: {
      slug: { sort: "asc", nulls: "last" },
    },
    select: {
      id: true,
      isPrivate: true,
      hideBranding: true,
      // Organizations removed - no parent org data selected
      logoUrl: true,
      name: true,
      slug: true,
      brandColor: true,
      darkBrandColor: true,
      theme: true,
    },
  });
}
