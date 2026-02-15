import { unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { checkAdminOrOwner } from "@calcom/features/auth/lib/checkAdminOrOwner";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import type { TeamFeatures } from "@calcom/features/flags/config";
import { FeaturesRepository } from "@calcom/features/flags/features.repository";
import { PermissionMapper } from "@calcom/features/pbac/domain/mappers/PermissionMapper";
import { Resource, CrudAction, CustomAction } from "@calcom/features/pbac/domain/types/permission-registry";
import { PermissionCheckService } from "@calcom/features/pbac/services/permission-check.service";
import { prisma } from "@calcom/prisma";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

import type { SettingsLayoutProps } from "./SettingsLayoutAppDirClient";
import SettingsLayoutAppDirClient from "./SettingsLayoutAppDirClient";

const getTeamFeatures = unstable_cache(
  async (teamId: number) => {
    const featuresRepository = new FeaturesRepository(prisma);
    return await featuresRepository.getEnabledTeamFeatures(teamId);
  },
  ["team-features"],
  {
    revalidate: 120,
  }
);

const getCachedResourcePermissions = unstable_cache(
  async (userId: number, teamId: number, resource: Resource) => {
    const permissionService = new PermissionCheckService();
    return permissionService.getResourcePermissions({ userId, teamId, resource });
  },
  ["resource-permissions"],
  { revalidate: 120 }
);

export default async function SettingsLayoutAppDir(props: SettingsLayoutProps) {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const userId = session?.user?.id;
  if (!userId) {
    return redirect("/auth/login");
  }

  let teamFeatures: Record<number, TeamFeatures> | null = null;
  let canViewRoles = false;
  let canViewOrganizationBilling = false;
  let canUpdateOrganization = false;
  let canViewAttributes = false;
  const orgId = session?.user?.profile?.organizationId ?? session?.user.org?.id;

  // Organizations removed (EE feature) - PBAC and org permissions dead code deleted
  // Self-hosters don't have organization-based permissions or PBAC

  return (
    <>
      <SettingsLayoutAppDirClient
        {...props}
        teamFeatures={teamFeatures ?? {}}
        permissions={{ canViewRoles, canViewOrganizationBilling, canUpdateOrganization, canViewAttributes }}
      />
    </>
  );
}
