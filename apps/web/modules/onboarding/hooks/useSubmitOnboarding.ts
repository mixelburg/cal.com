import { useState } from "react";

// setShowNewOrgModalFlag removed (EE organization feature)
import { useFlagMap } from "@calcom/features/flags/context/provider";
import { CreationSource } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { showToast } from "@calcom/ui/components/toast";

import type { OnboardingState } from "../store/onboarding-store";

export const useSubmitOnboarding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flags = useFlagMap();

  // Organization creation removed (EE feature)

  const submitOnboarding = async (
    store: OnboardingState,
    _userEmail: string,
    _invitesToSubmit: OnboardingState["invites"]
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { selectedPlan, resetOnboarding } = store;

      if (selectedPlan === "organization") {
        throw new Error("Organization plan not available in self-hosted version");
      }

      // Skip to personal onboarding
      skipToPersonal(resetOnboarding);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create organization";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Organization creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipToPersonal = (resetOnboarding: () => void) => {
    resetOnboarding();
    const gettingStartedPath = flags["onboarding-v3"] ? "/onboarding/personal/settings" : "/getting-started";
    // Use window.location.href for a full page reload to ensure JWT callback runs
    // without trigger="update", which will call autoMergeIdentities() and fetch org data
    window.location.href = gettingStartedPath;
  };

  return {
    submitOnboarding,
    skipToPersonal,
    isSubmitting,
    error,
  };
};
