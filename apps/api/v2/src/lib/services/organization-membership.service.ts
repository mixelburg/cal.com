import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationMembershipService {
  async shouldAutoAccept(_props: { organizationId: number; userEmail: string }) {
    return false;
  }
}

