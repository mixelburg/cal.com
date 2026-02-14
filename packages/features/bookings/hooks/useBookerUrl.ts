import { WEBAPP_URL, WEBSITE_URL } from "@calcom/lib/constants";

export const useBookerUrl = () => {
  const orgBranding = null; // Organizations removed (EE feature)
  return orgBranding?.fullDomain ?? WEBSITE_URL ?? WEBAPP_URL;
};

export const useEmbedBookerUrl = () => {
  const orgBranding = null; // Organizations removed (EE feature)
  return orgBranding?.fullDomain ?? WEBAPP_URL;
};
