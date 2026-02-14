// Stub for removed EE organization billing - self-hosters don't have org billing
export class OrganizationBillingPortalService {
  protected permissionService: any;
  protected teamRepository: any;
  protected contextName = "Organization";

  constructor() {
    this.permissionService = null;
    this.teamRepository = null;
  }

  protected async createBillingPortalUrl(_customerId: string, _returnUrl: string): Promise<string> {
    return "";
  }

  protected buildReturnUrl(_returnTo?: string): string {
    return "";
  }

  protected getValidatedTeamSubscriptionId(_metadata: any) {
    return null;
  }

  protected getValidatedTeamSubscriptionIdForPlatform(_subscriptionId?: string | null) {
    return null;
  }

  async checkPermissions(_userId: number, _teamId: number): Promise<boolean> {
    return false;
  }

  async getCustomerId(_teamId: number): Promise<string | null> {
    return null;
  }

  async processBillingPortal(_userId: number, _teamId: number, _returnUrl: string, _res: any): Promise<void> {
    return;
  }
}
