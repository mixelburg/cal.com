"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { ButtonGroup } from "@calcom/ui/components/buttonGroup";
import { ChartBarIcon, CreditCardIcon, GlobeIcon, LockIcon, PaintbrushIcon, UsersIcon } from "@coss/ui/icons";

import Shell from "~/shell/Shell";
// UpgradeTip removed (EE billing feature)

export default function EnterprisePage() {
  const { t } = useLocale();

  const features = [
    {
      icon: <GlobeIcon className="h-5 w-5 text-red-500" />,
      title: t("branded_subdomain"),
      description: t("branded_subdomain_description"),
    },
    {
      icon: <ChartBarIcon className="h-5 w-5 text-blue-500" />,
      title: t("org_insights"),
      description: t("org_insights_description"),
    },
    {
      icon: <PaintbrushIcon className="h-5 w-5 text-pink-500" />,
      title: t("extensive_whitelabeling"),
      description: t("extensive_whitelabeling_description"),
    },
    {
      icon: <UsersIcon className="h-5 w-5 text-orange-500" />,
      title: t("unlimited_teams"),
      description: t("unlimited_teams_description"),
    },
    {
      icon: <CreditCardIcon className="h-5 w-5 text-green-500" />,
      title: t("unified_billing"),
      description: t("advanced_managed_events_description"),
    },
    {
      icon: <LockIcon className="h-5 w-5 text-purple-500" />,
      title: t("advanced_managed_events"),
      description: t("advanced_managed_events_description"),
    },
  ];
  return (
    <div>
      <Shell heading={t("enterprise")} subtitle={t("enterprise_description")}>
        {/* UpgradeTip removed (EE billing feature) */}
        <div className="p-8 text-center">
          <p>Enterprise features are not available for self-hosted instances.</p>
        </div>
      </Shell>
    </div>
  );
}
