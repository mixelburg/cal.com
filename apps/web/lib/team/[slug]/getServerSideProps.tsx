import type { GetServerSidePropsContext } from "next";

import { FeaturesRepository } from "@calcom/features/flags/features.repository";
import { IS_CALCOM } from "@calcom/lib/constants";
import { getUserAvatarUrl } from "@calcom/lib/getAvatarUrl";
import logger from "@calcom/lib/logger";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import slugify from "@calcom/lib/slugify";
import { stripMarkdown } from "@calcom/lib/stripMarkdown";
import prisma from "@calcom/prisma";
import type { Team } from "@calcom/prisma/client";
import { RedirectType } from "@calcom/prisma/enums";
import { teamMetadataSchema } from "@calcom/prisma/zod-utils";

import { handleOrgRedirect } from "@lib/handleOrgRedirect";

const log = logger.getSubLogger({ prefix: ["team/[slug]"] });

// Organizations removed - no verified domain redirects for self-hosters

const getTheLastArrayElement = (value: ReadonlyArray<string> | string | undefined): string | undefined => {
  if (value === undefined || typeof value === "string") {
    return value;
  }

  return value.at(-1);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const slug = getTheLastArrayElement(context.query.slug) ?? getTheLastArrayElement(context.query.orgSlug);

  // Organizations removed - no org domain config or redirects for self-hosters
  // handleOrgRedirect always returns null (already stubbed)
  
  const featuresRepository = new FeaturesRepository(prisma);
  const organizationsEnabled = false;

  log.debug("getServerSideProps", {
    slug,
    organizationsEnabled: false,
  });

  // Fetch team with members and event types (org logic removed)
  const team = await prisma.team.findFirst({
    where: {
      OR: [
        { slug: slugify(slug ?? "") },
        { metadata: { path: ["requestedSlug"], equals: slug } },
      ],
      // Organizations removed - teams don't have parent orgs
      parent: null,
    },
    include: {
      parent: true,
      eventTypes: {
        include: {
          users: {
            include: {
              profiles: {
                include: {
                  organization: true,
                },
              },
            },
          },
        },
      },
      members: {
        include: {
          user: {
            include: {
              profiles: {
                include: {
                  organization: true,
                },
              },
            },
          },
        },
      },
      children: true,
    },
  });

  const metadata = teamMetadataSchema.parse(team?.metadata ?? {});

  // Organizations removed - no sub-teams or org domains for self-hosters
  // If organizations feature is disabled (always for self-hosters), skip org checks

  if (!team) {
    // Because we are fetching by requestedSlug being set, it can either be an organization or a regular team. But it can't be a sub-team i.e.
    const unpublishedTeam = await prisma.team.findFirst({
      where: {
        metadata: {
          path: ["requestedSlug"],
          equals: slug,
        },
      },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            name: true,
            isPrivate: true,
            isOrganization: true,
            metadata: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!unpublishedTeam) return { notFound: true } as const;
    const teamParent = unpublishedTeam.parent ? getTeamWithoutMetadata(unpublishedTeam.parent) : null;
    return {
      props: {
        considerUnpublished: true,
        team: {
          ...unpublishedTeam,
          parent: teamParent,
          createdAt: null,
        },
      },
    } as const;
  }

  // Organizations removed - no org settings or verified domain redirects for self-hosters
  const allowSEOIndexing = false;

  const isTeamOrParentOrgPrivate = team.isPrivate || (team.parent?.isOrganization && team.parent?.isPrivate);

  const minimalEventTypes =
    team.eventTypes?.map((type) => ({
      // Fields from baseEventTypeSelect (except description which becomes descriptionAsSafeHTML)
      id: type.id,
      title: type.title,
      slug: type.slug,
      length: type.length,
      schedulingType: type.schedulingType,
      recurringEvent: type.recurringEvent,
      hidden: type.hidden,
      price: type.price,
      currency: type.currency,
      lockTimeZoneToggleOnBookingPage: type.lockTimeZoneToggleOnBookingPage,
      lockedTimeZone: type.lockedTimeZone,
      requiresConfirmation: type.requiresConfirmation,
      requiresBookerEmailVerification: type.requiresBookerEmailVerification,
      canSendCalVideoTranscriptionEmails: type.canSendCalVideoTranscriptionEmails,
      seatsPerTimeSlot: type.seatsPerTimeSlot,
      // Additional fields needed by EventTypeDescription
      metadata: type.metadata,
      descriptionAsSafeHTML: markdownToSafeHTML(type.description),
      users: !isTeamOrParentOrgPrivate
        ? type.users.map((user) => {
            // Organizations removed - use primary profile only
            const primaryProfile = user.profiles?.[0];
            return {
              name: user.name,
              username: user.username,
              avatarUrl: user.avatarUrl,
              avatar: getUserAvatarUrl(user),
              profile: primaryProfile
                ? {
                    id: primaryProfile.id,
                    uid: primaryProfile.uid,
                    username: primaryProfile.username,
                    organizationId: primaryProfile.organizationId,
                    organization: primaryProfile.organization
                      ? {
                          id: primaryProfile.organization.id,
                          slug: primaryProfile.organization.slug,
                          name: primaryProfile.organization.name,
                          // requestedSlug is in metadata, not a direct field on Team
                          calVideoLogo: primaryProfile.organization.calVideoLogo,
                          bannerUrl: primaryProfile.organization.bannerUrl,
                        }
                      : null,
                  }
                : null,
            };
          })
        : [],
    })) ?? null;

  const safeBio = markdownToSafeHTML(team.bio) || "";

  const minimalMembers = !isTeamOrParentOrgPrivate
    ? team.members.map((member) => {
        // Organizations removed - profiles are for org structure, use primary profile only
        const primaryProfile = member.user.profiles?.[0];
        return {
          id: member.user.id,
          name: member.user.name,
          username: member.user.username,
          avatarUrl: member.user.avatarUrl,
          bio: member.user.bio,
          organizationId: primaryProfile?.organizationId ?? null,
          subteams: [], // Organizations removed - no subteams for self-hosters
          accepted: member.accepted,
          profile: primaryProfile
            ? {
                id: primaryProfile.id,
                username: primaryProfile.username,
                organizationId: primaryProfile.organizationId,
                organization: primaryProfile.organization
                  ? {
                      id: primaryProfile.organization.id,
                      slug: primaryProfile.organization.slug,
                      name: primaryProfile.organization.name,
                      // requestedSlug is in metadata, not a direct field on Team
                      calVideoLogo: primaryProfile.organization.calVideoLogo,
                      bannerUrl: primaryProfile.organization.bannerUrl,
                    }
                  : null,
              }
            : null,
          safeBio: markdownToSafeHTML(member.user.bio || ""),
          bookerUrl: "", // Organizations removed (EE feature)
        };
      })
    : [];

  const markdownStrippedBio = stripMarkdown(team?.bio || "");

  // Organizations removed - no parent teams/orgs for self-hosters
  const minimalParent = null;

  const minimalChildren = isTeamOrParentOrgPrivate
    ? []
    : team.children.map((child) => ({
        slug: child.slug,
        name: child.name,
      }));

  // Organizations removed - simple unpublished check (no parent orgs)
  const isUnpublished = !team.slug;
  const isARedirectFromNonOrgLink = context.query.orgRedirection === "true";

  const considerUnpublished = isUnpublished && !isARedirectFromNonOrgLink;

  if (considerUnpublished) {
    return {
      props: {
        considerUnpublished: true,
        team: {
          id: team.id,
          slug: team.slug,
          name: team.name,
          isOrganization: team.isOrganization,
          logoUrl: team.logoUrl,
          metadata,
          parent: minimalParent,
          createdAt: null,
        },
      },
    } as const;
  }

  return {
    props: {
      team: {
        id: team.id,
        slug: team.slug,
        name: team.name,
        bio: team.bio,
        safeBio,
        theme: team.theme,
        isPrivate: team.isPrivate,
        isOrganization: team.isOrganization,
        hideBookATeamMember: team.hideBookATeamMember,
        logoUrl: team.logoUrl,
        brandColor: team.brandColor,
        darkBrandColor: team.darkBrandColor,
        metadata,
        parent: minimalParent,
        eventTypes: minimalEventTypes,
        members: minimalMembers,
        children: minimalChildren,
      },
      themeBasis: team.slug,
      markdownStrippedBio,
      isValidOrgDomain: false, // Organizations removed
      currentOrgDomain: null, // Organizations removed
      isSEOIndexable: allowSEOIndexing,
    },
  } as const;
};

/**
 * Removes metadata from team and just adds requestedSlug
 */
function getTeamWithoutMetadata<T extends Pick<Team, "metadata">>(team: T) {
  const { metadata, ...rest } = team;
  const teamMetadata = teamMetadataSchema.parse(metadata);
  return {
    ...rest,
    ...(typeof teamMetadata?.requestedSlug !== "undefined"
      ? { requestedSlug: teamMetadata?.requestedSlug }
      : {}),
  };
}
