import type { SearchParams } from "app/_types";
import type { Session } from "next-auth";
import { unstable_cache } from "next/cache";

import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";
import { PermissionCheckService } from "@calcom/features/pbac/services/permission-check.service";
import { ErrorWithCode } from "@calcom/lib/errors";
import prisma from "@calcom/prisma";
import { MembershipRole } from "@calcom/prisma/enums";

import { TeamsListing } from "~/ee/teams/components/TeamsListing";

import { TeamsCTA } from "./CTA";

// Team invitation helpers - simplified for self-hosted (organizations removed)
class TeamInvitationService {
  static async acceptInvitationByToken(token: string, userId: number): Promise<void> {
    // Find the membership by token (check if team has this token)
    const membership = await prisma.membership.findFirst({
      where: { 
        team: { 
          inviteTokens: { 
            some: { 
              token: token 
            } 
          } 
        }, 
        userId: userId, 
        accepted: false 
      },
    });
    
    if (!membership) {
      throw new Error("Invalid invitation token or already accepted");
    }
    
    // Accept the membership
    await prisma.membership.update({
      where: { id: membership.id },
      data: { accepted: true },
    });
  }
  
  static async inviteMemberByToken(token: string, userId: number): Promise<string> {
    // Find the team by token
    const team = await prisma.team.findFirst({
      where: { 
        inviteTokens: { 
          some: { 
            token: token 
          } 
        } 
      },
      select: { id: true, name: true },
    });
    
    if (!team) {
      throw new Error("Invalid invitation token");
    }
    
    // Check if membership already exists
    const existingMembership = await prisma.membership.findFirst({
      where: { teamId: team.id, userId: userId },
    });
    
    if (existingMembership) {
      throw new Error("You are already a member of this team");
    }
    
    return team.name;
  }
}

const getCachedTeams = unstable_cache(
  async (userId: number) => {
    const teamRepo = new TeamRepository(prisma);
    return await teamRepo.findTeamsByUserId({
      userId,
      includeOrgs: true,
    });
  },
  undefined,
  { revalidate: 3600, tags: ["viewer.teams.list"] } // Cache for 1 hour
);

export const ServerTeamsListing = async ({
  searchParams,
  session,
}: {
  searchParams: SearchParams;
  session: Session;
}) => {
  const token = Array.isArray(searchParams?.token) ? searchParams.token[0] : searchParams?.token;
  const autoAccept = Array.isArray(searchParams?.autoAccept)
    ? searchParams.autoAccept[0]
    : searchParams?.autoAccept;
  const userId = session.user.id;
  let invitationAccepted = false;

  let teamNameFromInvite,
    errorMsgFromInvite = null;

  if (token) {
    try {
      if (autoAccept === "true") {
        await TeamInvitationService.acceptInvitationByToken(token, userId);
        invitationAccepted = true;
      } else {
        teamNameFromInvite = await TeamInvitationService.inviteMemberByToken(token, userId);
      }
    } catch (e) {
      errorMsgFromInvite = "Error while fetching teams";
      if (e instanceof ErrorWithCode) errorMsgFromInvite = e.message;
    }
  }

  const teams = await getCachedTeams(userId);
  const userProfile = session?.user?.profile;
  const orgId = userProfile?.organizationId ?? session?.user.org?.id;

  const permissionCheckService = new PermissionCheckService();
  const canCreateTeam = orgId
    ? await permissionCheckService.checkPermission({
        userId: session.user.id,
        teamId: orgId,
        permission: "team.create",
        fallbackRoles: [MembershipRole.ADMIN, MembershipRole.OWNER],
      })
    : false;

  return {
    Main: (
      <TeamsListing
        invitationAccepted={invitationAccepted}
        teams={teams}
        orgId={orgId ?? null}
        permissions={{
          canCreateTeam: canCreateTeam,
        }}
        teamNameFromInvite={teamNameFromInvite ?? null}
        errorMsgFromInvite={errorMsgFromInvite}
      />
    ),
    CTA: !orgId || canCreateTeam ? <TeamsCTA /> : null,
  };
};
