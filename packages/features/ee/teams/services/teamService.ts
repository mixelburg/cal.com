import { randomBytes } from "node:crypto";
// EE feature removed: import { getTeamBillingServiceFactory } from "@calcom/ee/billing/di/containers/Billing";
// EE feature removed: import { SeatChangeTrackingService } from "@calcom/features/ee/billing/service/seatTracking/SeatChangeTrackingService";
// EE feature removed: import { deleteWorkfowRemindersOfRemovedMember } from "@calcom/features/ee/teams/lib/deleteWorkflowRemindersOfRemovedMember";
import { updateNewTeamMemberEventTypes } from "@calcom/features/ee/teams/lib/queries";
import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";
// EE feature removed: import { WorkflowService } from "@calcom/features/ee/workflows/lib/service/WorkflowService";
// EE feature removed: import { OnboardingPathService } from "@calcom/features/onboarding/lib/onboarding-path.service";
// EE feature removed: import { createAProfileForAnExistingUser } from "@calcom/features/profile/lib/createAProfileForAnExistingUser";
// EE feature removed: import { ProfileRepository } from "@calcom/features/profile/repositories/ProfileRepository";
import { WEBAPP_URL } from "@calcom/lib/constants";
// EE feature removed: import { deleteDomain } from "@calcom/lib/domainManager/organization";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import logger from "@calcom/lib/logger";
import { prisma } from "@calcom/prisma";
import type { Membership } from "@calcom/prisma/client";
import { Prisma } from "@calcom/prisma/client";
import { MembershipRole } from "@calcom/prisma/enums";

const log = logger.getSubLogger({ prefix: ["TeamService"] });

type MembershipWithRelations = Pick<
  Membership,
  "id" | "userId" | "teamId" | "role" | "accepted" | "disableImpersonation"
>;

type TeamWithSettings = {
  id: number;
  isOrganization: boolean | null;
  organizationSettings: unknown;
  metadata: unknown;
  activeOrgWorkflows: unknown;
  parentId: number | null;
};

type UserWithTeams = {
  id: number;
  movedToProfileId: number | null;
  email: string;
  username: string | null;
  completedOnboarding: boolean;
  teams: {
    team: {
      id: number;
      parentId: number | null;
    };
  }[];
};

export type RemoveMemberResult = {
  membership: MembershipWithRelations;
};

export class TeamService {
  static async createInvite(
    teamId: number,
    options?: { token?: string }
  ): Promise<{ token: string; inviteLink: string }> {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { parentId: true, isOrganization: true },
    });

    if (!team) throw new ErrorWithCode(ErrorCode.NotFound, "Team not found");

    const isOrganizationOrATeamInOrganization = !!(team.parentId || team.isOrganization);

    if (options?.token) {
      const existingToken = await prisma.verificationToken.findFirst({
        where: {
          token: options.token,
          identifier: `invite-link-for-teamId-${teamId}`,
          teamId,
        },
      });
      if (!existingToken) throw new ErrorWithCode(ErrorCode.NotFound, "Invite token not found");
      return {
        token: existingToken.token,
        inviteLink: await TeamService.buildInviteLink(
          existingToken.token,
          isOrganizationOrATeamInOrganization
        ),
      };
    }

    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: `invite-link-for-teamId-${teamId}`,
        token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +1 week
        expiresInDays: 7,
        teamId,
      },
    });

    return {
      token,
      inviteLink: await TeamService.buildInviteLink(token, isOrganizationOrATeamInOrganization),
    };
  }

  private static async buildInviteLink(token: string, isOrgContext: boolean): Promise<string> {
    // Organizations removed - always return simple team invite link
    return `${WEBAPP_URL}/teams?token=${token}`;
  }
  /**
   * Deletes a team and all its associated data.
   * EE features removed: billing subscription cancellation, workflow cleanup, org domain deletion.
   */
  static async delete({ id }: { id: number }) {
    // Team billing removed - no subscription cancellation needed
    // Workflow reminders removed - no cleanup needed
    // Delete the team from the database
    const teamRepo = new TeamRepository(prisma);
    const deletedTeam = await teamRepo.deleteById({ id });
    // Organization domain management removed - no domain deletion needed
    return deletedTeam;
  }

  static async removeMembers({
    teamIds,
    userIds,
    isOrg = false,
  }: {
    teamIds: number[];
    userIds: number[];
    isOrg?: boolean;
  }) {
    const deleteMembershipPromises: Promise<RemoveMemberResult>[] = [];

    for (const userId of userIds) {
      for (const teamId of teamIds) {
        deleteMembershipPromises.push(
          TeamService.removeMember({
            teamId,
            userId,
            isOrg,
          })
        );
      }
    }

    await Promise.all(deleteMembershipPromises);
    // Team billing removed - no subscription quantity update needed
  }

  static async inviteMemberByToken(token: string, userId: number) {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        OR: [{ expiresInDays: null }, { expires: { gte: new Date() } }],
      },
      select: {
        teamId: true,
        team: {
          select: {
            name: true,
            parentId: true,
          },
        },
      },
    });

    if (!verificationToken) throw new ErrorWithCode(ErrorCode.NotFound, "Invite not found");
    if (!verificationToken.teamId || !verificationToken.team)
      throw new ErrorWithCode(ErrorCode.NotFound, "Invite token is not associated with any team");

    try {
      await prisma.membership.create({
        data: {
          createdAt: new Date(),
          teamId: verificationToken.teamId,
          userId: userId,
          role: MembershipRole.MEMBER,
          accepted: false,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ErrorWithCode(
            ErrorCode.Forbidden,
            "This user is a member of this team / has a pending invitation."
          );
        }
      } else throw e;
    }

    // Billing seat tracking removed - no seat addition logging needed
    // Team billing removed - no subscription quantity update needed

    return verificationToken.team.name;
  }

  static async acceptTeamMembership({
    userId,
    teamId,
    userEmail,
    username,
  }: {
    userId: number;
    teamId: number;
    userEmail: string;
    username: string | null;
  }) {
    const teamMembership = await prisma.membership.update({
      where: {
        userId_teamId: { userId, teamId },
      },
      data: {
        accepted: true,
      },
      select: {
        team: true,
      },
    });

    const team = teamMembership.team;

    // Organizations removed - no parent org membership handling needed
    if (team.parentId) {
      log.debug("Organizations removed - ignoring parent org membership acceptance", {
        teamId,
        parentId: team.parentId,
      });
    }

    // Organizations removed - no org profile creation needed
    const isASubteam = team.parentId !== null;
    const idOfOrganizationInContext = team.isOrganization ? team.id : isASubteam ? team.parentId : null;
    if (idOfOrganizationInContext) {
      log.debug("Organizations removed - skipping org profile creation", { userId, organizationId: idOfOrganizationInContext });
    }

    await updateNewTeamMemberEventTypes(userId, teamId);
  }
  static async leaveTeamMembership({ userId, teamId }: { userId: number; teamId: number }) {
    try {
      const membership = await prisma.membership.delete({
        where: {
          userId_teamId: { userId, teamId },
        },
        select: {
          team: true,
        },
      });

      // Organizations removed - no parent org membership deletion needed
      if (membership.team.parentId) {
        log.debug("Organizations removed - ignoring parent org membership on leave", {
          teamId,
          parentId: membership.team.parentId,
        });
      }

      // Billing seat tracking removed - no seat removal logging needed
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          throw new ErrorWithCode(ErrorCode.NotFound, "Membership not found");
        }
      }
      throw e;
    }
  }

  static async acceptInvitationByToken(acceptanceToken: string, userId: number) {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: acceptanceToken,
        expires: { gte: new Date() },
      },
      select: {
        identifier: true,
        teamId: true,
        team: { select: { name: true } },
      },
    });

    if (!verificationToken) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Invite not found");
    }

    if (!verificationToken.teamId || !verificationToken.team) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Invite token is not associated with any team");
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, username: true },
    });

    if (!currentUser) {
      throw new ErrorWithCode(ErrorCode.NotFound, "User not found");
    }

    if (
      currentUser.email !== verificationToken.identifier &&
      currentUser.username !== verificationToken.identifier
    ) {
      throw new ErrorWithCode(ErrorCode.Forbidden, "This invitation is not for your account");
    }

    await TeamService.acceptTeamMembership({
      userId,
      teamId: verificationToken.teamId,
      userEmail: currentUser.email,
      username: currentUser.username,
    });
  }

  // EE feature removed: publish() method (team billing only)

  private static async removeMember({
    userId,
    teamId,
    isOrg,
  }: {
    userId: number;
    teamId: number;
    isOrg: boolean;
  }) {
    const membership = await TeamService.fetchMembershipOrThrow(userId, teamId);
    const team = await TeamService.fetchTeamOrThrow(teamId);
    const user = await TeamService.fetchUserOrThrow(userId);

    if (isOrg) {
      // Organizations removed - treat as regular team removal
      log.debug("Organizations removed - removing member from team (isOrg flag ignored)", { userId, teamId });
      await TeamService.removeFromTeam(membership, teamId);
    } else {
      log.debug("Removing a member from a team");
      await TeamService.removeFromTeam(membership, teamId);
    }

    // Workflow reminders removed - no cleanup needed
    // Billing seat tracking removed - no seat removal logging needed

    return { membership };
  }

  // TODO: Needs to be moved to repository
  private static async fetchMembershipOrThrow(
    userId: number,
    teamId: number
  ): Promise<MembershipWithRelations> {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_teamId: { userId: userId, teamId: teamId },
      },
      select: {
        id: true,
        userId: true,
        teamId: true,
        role: true,
        accepted: true,
        disableImpersonation: true,
      },
    });

    if (!membership) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Membership not found");
    }

    return membership;
  }

  // TODO: Needs to be moved to repository
  static async fetchTeamOrThrow(teamId: number): Promise<TeamWithSettings> {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        isOrganization: true,
        organizationSettings: true,
        id: true,
        metadata: true,
        activeOrgWorkflows: true,
        parentId: true,
      },
    });

    if (!team) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Team not found");
    }

    return team;
  }

  // TODO: Needs to be moved to repository
  private static async fetchUserOrThrow(userId: number): Promise<UserWithTeams> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        movedToProfileId: true,
        email: true,
        username: true,
        completedOnboarding: true,
        teams: {
          select: {
            team: {
              select: {
                id: true,
                parentId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ErrorWithCode(ErrorCode.NotFound, "User not found");
    }

    return user;
  }

  // EE feature removed: cleanupTempOrgRedirect() and removeFromOrganization() methods (org-specific)

  // Remove member from regular team
  private static async removeFromTeam(membership: MembershipWithRelations, teamId: number) {
    await prisma.$transaction([
      // Remove user from all team event types' hosts
      prisma.host.deleteMany({
        where: {
          userId: membership.userId,
          eventType: {
            teamId: teamId,
          },
        },
      }),
      // Deleted managed event types from this team for this member
      prisma.eventType.deleteMany({
        where: { parent: { teamId: teamId }, userId: membership.userId },
      }),
      // Delete the membership of the user from the team
      prisma.membership.delete({
        where: {
          userId_teamId: { userId: membership.userId, teamId: teamId },
        },
      }),
    ]);
  }
}
