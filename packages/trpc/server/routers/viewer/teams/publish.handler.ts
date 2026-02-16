import { TeamService } from "@calcom/features/ee/teams/services/teamService";
import { PermissionCheckService } from "@calcom/features/pbac/services/permission-check.service";
import { WEBAPP_URL } from "@calcom/lib/constants";
import { MembershipRole } from "@calcom/prisma/enums";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../types";
import type { TPublishInputSchema } from "./publish.schema";

type PublishOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TPublishInputSchema;
};

async function checkPermissions({ ctx, input }: PublishOptions) {
  const { profile } = ctx.user;
  const permissionCheckService = new PermissionCheckService();

  const isOrg = !!profile?.organizationId;
  const permission = isOrg ? "organization.update" : "team.update";
  const teamId = isOrg ? profile.organizationId : input.teamId;

  const hasUpdatePermission = await permissionCheckService.checkPermission({
    userId: ctx.user.id,
    teamId,
    permission,
    fallbackRoles: [MembershipRole.OWNER, MembershipRole.ADMIN],
  });

  if (!hasUpdatePermission) throw new TRPCError({ code: "UNAUTHORIZED" });
}

export const publishHandler = async ({ ctx, input }: PublishOptions) => {
  const { teamId } = input;
  await checkPermissions({ ctx, input });

  await TeamService.publish(teamId);

  return {
    url: `${WEBAPP_URL}/settings/teams/${teamId}/profile`,
    message: "Team published successfully",
  };
};

export default publishHandler;
