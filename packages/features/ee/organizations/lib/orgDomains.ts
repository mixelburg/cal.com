import slugify from "@calcom/lib/slugify";
import { WEBAPP_URL } from "@calcom/lib/constants";
import type { Prisma } from "@calcom/prisma/client";

export function getOrgDomainConfig({
  forcedSlug,
  isPlatform,
}: {
  hostname: string;
  fallback?: string | string[];
  forcedSlug?: string;
  isPlatform?: boolean;
}) {
  if (isPlatform && forcedSlug) {
    return {
      isValidOrgDomain: true,
      currentOrgDomain: forcedSlug,
    };
  }

  return {
    currentOrgDomain: null,
    isValidOrgDomain: false,
  };
}

export function getOrgFullOrigin(_slug: string | null, options: { protocol: boolean } = { protocol: true }) {
  return options.protocol ? WEBAPP_URL : WEBAPP_URL.replace("https://", "").replace("http://", "");
}

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
