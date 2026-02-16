import { getSlugOrRequestedSlug } from "@calcom/features/ee/organizations/lib/orgDomains";
import { prisma } from "@calcom/prisma";

export type TeamData = Awaited<ReturnType<typeof getTeamData>>;

/**
 * Organizations removed - fetches team data without parent org context
 * For self-hosted: teams exist but don't have organization parents
 */
export async function getTeamData(teamSlug: string, orgSlug: string | null) {
  // For self-hosted, orgSlug is always null - fetch team directly by slug
  const team = await prisma.team.findFirst({
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
      logoUrl: true,
      name: true,
      slug: true,
      brandColor: true,
      darkBrandColor: true,
      theme: true,
    },
  });

  if (!team) return null;

  // Organizations removed - return null parent for type compatibility
  return {
    ...team,
    parent: null as null,
  };
}
