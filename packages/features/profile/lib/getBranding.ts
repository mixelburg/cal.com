type EventTypeWithBranding = {
  team?: {
    name?: string;
    brandColor?: string | null;
    darkBrandColor?: string | null;
    theme?: string | null;
    parent?: {
      brandColor?: string | null;
      darkBrandColor?: string | null;
      theme?: string | null;
    } | null;
  } | null;
  profile?: {
    organization?: {
      brandColor?: string | null;
      darkBrandColor?: string | null;
      theme?: string | null;
    } | null;
  } | null;
  users: Array<{
    theme?: string | null;
    brandColor?: string | null;
    darkBrandColor?: string | null;
  }>;
};

type UserWithBranding = {
  theme?: string | null;
  brandColor?: string | null;
  darkBrandColor?: string | null;
  profile: {
    organization?: {
      brandColor?: string | null;
      darkBrandColor?: string | null;
      theme?: string | null;
    } | null;
  };
};

type TeamWithBranding = {
  brandColor?: string | null;
  darkBrandColor?: string | null;
  theme?: string | null;
  parent?: {
    brandColor?: string | null;
    darkBrandColor?: string | null;
    theme?: string | null;
  } | null;
};

type BrandingResult = {
  theme: string | null;
  brandColor: string | null;
  darkBrandColor: string | null;
};

export function getBrandingForEventType(params: { eventType: EventTypeWithBranding }): BrandingResult {
  const { eventType } = params;

  if (eventType.team) {
    // Organizations removed - no parent team branding
    const brandColorData = eventType.team;
    return {
      theme: eventType.team.theme ?? null,
      brandColor: brandColorData.brandColor ?? null,
      darkBrandColor: brandColorData.darkBrandColor ?? null,
    };
  }

  // Organizations removed - use user branding, not org
  const branding = eventType.users[0];
  return {
    theme: branding?.theme ?? null,
    brandColor: branding?.brandColor ?? null,
    darkBrandColor: branding?.darkBrandColor ?? null,
  };
}

export function getBrandingForUser(params: { user: UserWithBranding }): BrandingResult {
  const { user } = params;
  // Organizations removed - use user branding, not org
  const branding = user;
  return {
    theme: branding.theme ?? null,
    brandColor: branding.brandColor ?? null,
    darkBrandColor: branding.darkBrandColor ?? null,
  };
}

export function getBrandingForTeam(params: { team: TeamWithBranding }): BrandingResult {
  const { team } = params;
  // Organizations removed - no parent team branding
  const brandColorData = team;
  return {
    theme: team.theme ?? null,
    brandColor: brandColorData.brandColor ?? null,
    darkBrandColor: brandColorData.darkBrandColor ?? null,
  };
}
