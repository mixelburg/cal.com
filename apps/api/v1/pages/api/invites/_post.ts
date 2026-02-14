import type { NextApiRequest, NextApiResponse } from "next";

import { HttpError } from "@calcom/lib/http-error";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";
import prisma from "@calcom/prisma";
import { CreationSource } from "@calcom/prisma/enums";
import { createContext } from "@calcom/trpc/server/createContext";
import { viewerTeamsRouter } from "@calcom/trpc/server/routers/viewer/teams/_router";
import type { TInviteMemberInputSchema } from "@calcom/trpc/server/routers/viewer/teams/inviteMember/inviteMember.schema";
import { ZInviteMemberInputSchema } from "@calcom/trpc/server/routers/viewer/teams/inviteMember/inviteMember.schema";
import { createCallerFactory } from "@calcom/trpc/server/trpc";
import type { UserProfile } from "@calcom/types/UserProfile";

import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const data = ZInviteMemberInputSchema.parse(req.body);
  await checkPermissions(req, data);

  async function sessionGetter() {
    return {
      user: {
        id: req.userId,
        uuid: req.userUuid,
        username: "",
        profile: {
          id: null,
          organizationId: null,
          organization: null,
          username: "",
          upId: "",
        } satisfies UserProfile,
      },
      hasValidLicense: true,
      expires: "",
      upId: "",
    };
  }

  // Team invitations not supported in self-hosted version (EE feature removed)
  throw new HttpError({
    statusCode: 501,
    message: "Team member invitations via API not supported in self-hosted version. Please use the web interface.",
  });
}

async function checkPermissions(req: NextApiRequest, body: TInviteMemberInputSchema) {
  const { userId, isSystemWideAdmin } = req;
  if (isSystemWideAdmin) return;
  // To prevent auto-accepted invites, limit it to ADMIN users
  if (!isSystemWideAdmin && "accepted" in body)
    throw new HttpError({ statusCode: 403, message: "ADMIN needed for `accepted`" });
  // Only team OWNERS and ADMINS can add other members
  const membership = await prisma.membership.findFirst({
    where: { userId, teamId: body.teamId, role: { in: ["ADMIN", "OWNER"] } },
  });
  if (!membership) throw new HttpError({ statusCode: 403, message: "You can't add members to this team" });
}

export default defaultResponder(postHandler);
