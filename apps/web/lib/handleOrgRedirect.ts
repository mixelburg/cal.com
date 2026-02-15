import type { ParsedUrlQuery } from "node:querystring";
import { stringify } from "node:querystring";

import { SINGLE_ORG_SLUG } from "@calcom/lib/constants";
import logger from "@calcom/lib/logger";
import { safeStringify } from "@calcom/lib/safeStringify";
import type { RedirectType } from "@calcom/prisma/client";

const log = logger.getSubLogger({ prefix: ["lib", "handleOrgRedirect"] });
type NextJsRedirect = {
  redirect: {
    permanent: false;
    /**
     * It could be a full URL or a relative path
     */
    destination: string;
  };
};

function getSearchString(relativeOrAbsoluteUrl: string) {
  const url = new URL(relativeOrAbsoluteUrl, "http://localhost");
  return url.search;
}

// Organizations removed - no org redirects for self-hosters
const getTemporaryOrgRedirect = async (): Promise<NextJsRedirect | null> => {
  return null;
};

interface HandleOrgRedirectParams {
  slugs: string[];
  redirectType: RedirectType;
  eventTypeSlug: string | null;
  context: {
    query: ParsedUrlQuery;
  };
  currentOrgDomain: string | null;
}

/**
 * Handles organization redirects for both regular org context and SINGLE_ORG_SLUG mode
 * The redirect is required for all existing user links and team links to keep working when a user/team is moved to an organization
 * Example:
 * - User "john87" is added to organization "acme" and his username in the organization is "john". So, cal.com/john87 is redirected to cal.com/john
 * - Team "acme-sales" is added to organization "acme" and its slug in the organization is "sales". So, cal.com/acme-sales is redirected to cal.com/sales
 *
 * Returns a redirect object if a redirect is needed, null otherwise
 */
// Organizations removed - no org redirects for self-hosters
export async function handleOrgRedirect({
  slugs,
  redirectType,
  eventTypeSlug,
  context,
  currentOrgDomain,
}: HandleOrgRedirectParams) {
  return null;
}

// Organizations removed - no org redirects for self-hosters
export async function getRedirectWithOriginAndSearchString({
  slugs,
  redirectType,
  context,
  currentOrgDomain,
}: Omit<HandleOrgRedirectParams, "eventTypeSlug">) {
  return null;
}
