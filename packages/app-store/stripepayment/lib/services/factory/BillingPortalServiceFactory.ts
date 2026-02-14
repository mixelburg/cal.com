import prisma from "@calcom/prisma";

import { OrganizationBillingPortalService } from "@calcom/features/ee/organizations/lib/OrganizationBillingPortalService";
import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";
import type { BillingPortalService } from "../base/BillingPortalService";
import { TeamBillingPortalService } from "../team/TeamBillingPortalService";
import { UserBillingPortalService } from "../user/UserBillingPortalService";

/**
 * Factory to create the appropriate billing portal service based on team type
 */
export class BillingPortalServiceFactory {
  /**
   * Creates billing portal service for teams
   * Self-hosters don't have org billing, so always return team service
   */
  static async createService(_teamId: number): Promise<BillingPortalService> {
    // Self-hosters don't have organizations or billing
    return new TeamBillingPortalService();
  }

  /**
   * Creates a user billing portal service
   */
  static createUserService(): UserBillingPortalService {
    return new UserBillingPortalService();
  }
}
