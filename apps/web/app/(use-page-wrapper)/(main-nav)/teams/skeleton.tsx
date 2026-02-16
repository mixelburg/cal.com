"use client";

import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import { TeamsCTA } from "app/(use-page-wrapper)/(main-nav)/teams/CTA";

import { useLocale } from "@calcom/lib/hooks/useLocale";

// EE feature removed: SkeletonLoaderTeamList (EE teams skeleton)

export const TeamsListSkeleton = () => {
  const { t } = useLocale();
  return (
    <ShellMainAppDir
      heading={t("teams")}
      subtitle={t("create_manage_teams_collaborative")}
      CTA={<TeamsCTA />}>
      {/* EE feature removed: SkeletonLoaderTeamList - no skeleton needed */}
    </ShellMainAppDir>
  );
};
