import { WEBAPP_URL, WEBSITE_URL } from "@calcom/lib/constants";

export const useBookerUrl = () => {
  // Organizations removed - always use WEBSITE_URL for self-hosters
  return WEBSITE_URL ?? WEBAPP_URL;
};

export const useEmbedBookerUrl = () => {
  // Organizations removed - always use WEBAPP_URL for self-hosters
  return WEBAPP_URL;
};
