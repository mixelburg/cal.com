import slugify from "@calcom/lib/slugify";
import type { Prisma } from "@calcom/prisma/client";

/**
 * Organizations removed - this helper now only handles team slug lookup
 * Kept for compatibility with team slug queries (including requestedSlug metadata)
 */
export function getSlugOrRequestedSlug(slug: string) {
  const slugifiedValue = slugify(slug);
  return {
    OR: [
      { slug: slugifiedValue },
      {
        metadata: {
          path: ["requestedSlug"],
          equals: slugifiedValue,
        },
      },
    ],
  } satisfies Prisma.TeamWhereInput;
}
