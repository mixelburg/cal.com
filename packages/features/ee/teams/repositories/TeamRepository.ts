import { getSlugOrRequestedSlug } from "@calcom/features/ee/organizations/lib/orgDomains";
import logger from "@calcom/lib/logger";
import type { PrismaClient } from "@calcom/prisma";
import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import { MembershipRole } from "@calcom/prisma/enums";

const log = logger.getSubLogger({ prefix: ["repository", "team"] });

const teamSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  parentId: true,
  metadata: true,
  isOrganization: true,
  isPlatform: true,
} satisfies Prisma.TeamSelect;

/**
 * TeamRepository - adapted for self-hosted (organizations removed)
 * Teams exist as standalone entities without parent organizations
 */
export class TeamRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findById({ id }: { id: number }) {
    return await this.prismaClient.team.findUnique({
      where: { id },
      select: teamSelect,
    });
  }

  async findByIdIncludePlatformBilling({ id }: { id: number }) {
    return await this.prismaClient.team.findUnique({
      where: { id },
      select: { ...teamSelect, platformBilling: true },
    });
  }

  async findFirstBySlugAndParentSlug({
    slug,
    parentSlug,
    select = teamSelect,
  }: {
    slug: string;
    parentSlug: string | null;
    select?: Prisma.TeamSelect;
  }) {
    // Organizations removed - ignore parentSlug, find team by slug only
    return await this.prismaClient.team.findFirst({
      where: {
        ...getSlugOrRequestedSlug(slug),
        // Organizations removed - teams don't have parents
        parentId: null,
      },
      select,
    });
  }

  async deleteById({ id }: { id: number }) {
    const deletedTeam = await this.prismaClient.$transaction(async (tx) => {
      await tx.eventType.deleteMany({
        where: {
          teamId: id,
          schedulingType: "MANAGED",
        },
      });

      await tx.membership.deleteMany({
        where: {
          teamId: id,
        },
      });

      const deletedTeam = await tx.team.delete({
        where: {
          id: id,
        },
      });

      return deletedTeam;
    });

    return deletedTeam;
  }

  async findTeamWithMembers(teamId: number) {
    return await this.prismaClient.team.findUnique({
      where: { id: teamId },
      select: {
        members: {
          select: {
            accepted: true,
          },
        },
        id: true,
        metadata: true,
        parentId: true,
        isOrganization: true,
      },
    });
  }

  async findTeamsByUserId({ userId, includeOrgs }: { userId: number; includeOrgs?: boolean }) {
    const memberships = await this.prismaClient.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isOrganization: true,
            inviteTokens: true,
            // Organizations removed - no parent field needed
            parentId: true,
          },
        },
      },
      orderBy: { role: "desc" },
    });

    return memberships
      .filter((mmship) => {
        if (includeOrgs) return true;
        return !mmship.team.isOrganization;
      })
      .map(({ team: { inviteTokens, ...team }, ...membership }) => {
        const inviteToken =
          membership.role === "OWNER" || membership.role === "ADMIN"
            ? inviteTokens.find((token) => token.identifier === `invite-link-for-teamId-${team.id}`)
            : null;

        return {
          role: membership.role,
          accepted: membership.accepted,
          ...team,
          inviteToken,
        };
      });
  }

  async findOwnedTeamsByUserId({ userId }: { userId: number }) {
    const memberships = await this.prismaClient.membership.findMany({
      where: {
        userId: userId,
        accepted: true,
        role: {
          in: [MembershipRole.OWNER, MembershipRole.ADMIN],
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            isOrganization: true,
          },
        },
      },
    });

    return memberships.filter((mmship) => !mmship.team.isOrganization).map((mmship) => mmship.team);
  }

  async findTeamSlugById({ id }: { id: number }) {
    return await this.prismaClient.team.findUnique({
      where: {
        id,
      },
      select: {
        slug: true,
      },
    });
  }

  async findTeamWithParentHideBranding({ teamId }: { teamId: number }) {
    return await this.prismaClient.team.findUnique({
      where: { id: teamId },
      select: {
        hideBranding: true,
        // Organizations removed - keep parent field for type compatibility, but it will be null
        parent: {
          select: {
            hideBranding: true,
          },
        },
      },
    });
  }

  async isSlugAvailableForUpdate({
    slug,
    teamId,
    parentId,
  }: {
    slug: string;
    teamId: number;
    parentId?: number | null;
  }) {
    const whereClause: Prisma.TeamWhereInput = {
      slug: {
        equals: slug,
        mode: "insensitive",
      },
      // Organizations removed - all teams have parentId: null
      parentId: null,
      NOT: { id: teamId },
    };

    const conflictingTeam = await this.prismaClient.team.findFirst({
      where: whereClause,
      select: { id: true },
    });

    return !conflictingTeam;
  }

  async getTeamByIdIfUserIsAdmin({ userId, teamId }: { userId: number; teamId: number }) {
    return await this.prismaClient.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        id: true,
        metadata: true,
        members: {
          where: {
            userId,
            role: {
              in: [MembershipRole.ADMIN, MembershipRole.OWNER],
            },
          },
        },
      },
    });
  }

  async findTeamsForCreditCheck({ teamIds }: { teamIds: number[] }) {
    return await this.prismaClient.team.findMany({
      where: { id: { in: teamIds } },
      select: {
        id: true,
        isOrganization: true,
        parentId: true,
        // Organizations removed - no parent relation needed
      },
    });
  }

  async findTeamMembersWithPermission({
    teamId,
    permission,
    fallbackRoles,
  }: {
    teamId: number;
    permission: string;
    fallbackRoles: MembershipRole[];
  }) {
    const { resource, action } = this.parsePermission(permission);

    type UserResult = {
      id: number;
      name: string | null;
      email: string;
      locale: string | null;
    };

    const users = await this.prismaClient.$queryRaw<UserResult[]>`
      SELECT DISTINCT u.id, u.name, u.email, u.locale
      FROM "Membership" m
      INNER JOIN "users" u ON m."userId" = u.id
      LEFT JOIN "Role" r ON m."customRoleId" = r.id
      LEFT JOIN "TeamFeatures" f ON m."teamId" = f."teamId" AND f."featureId" = 'pbac' AND f.enabled = true
      WHERE m."teamId" = ${teamId}
        AND m."accepted" = true
        AND (
          -- Scenario 1: PBAC enabled + custom role with permission
          (f."teamId" IS NOT NULL
           AND m."customRoleId" IS NOT NULL
           AND EXISTS (
             SELECT 1 FROM "RolePermission" rp
             WHERE rp."roleId" = r.id
               AND (
                 (rp."resource" = '*' AND rp."action" = '*') OR
                 (rp."resource" = ${resource} AND rp."action" = ${action}) OR
                 (rp."resource" = ${resource} AND rp."action" = '*') OR
                 (rp."resource" = '*' AND rp."action" = ${action})
               )
           ))
          OR
          -- Scenario 2 & 3: Legacy role ADMIN/OWNER (works for both PBAC and non-PBAC teams)
          (m."role"::text = ANY(${fallbackRoles}))
        )
    `;

    return users;
  }

  private parsePermission(permission: string): {
    resource: string;
    action: string;
  } {
    const lastDotIndex = permission.lastIndexOf(".");
    const resource = permission.substring(0, lastDotIndex);
    const action = permission.substring(lastDotIndex + 1);
    return { resource, action };
  }

  async findTeamBySlugWithAdminRole(teamSlug: string, userId: number) {
    return this.prismaClient.team.findFirst({
      select: { id: true },
      where: {
        slug: teamSlug,
        members: {
          some: {
            userId,
            role: {
              in: ["OWNER", "ADMIN"],
            },
          },
        },
      },
    });
  }
}
