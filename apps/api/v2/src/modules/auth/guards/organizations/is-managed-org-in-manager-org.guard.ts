import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsManagedOrgInManagerOrg implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const managedOrgId: string = request.params.managedOrganizationId;
    const managerOrgId: string = request.params.orgId;

    if (!managerOrgId) {
      throw new ForbiddenException("IsManagedOrgInManagerOrg - No manager org id found in request params.");
    }

    if (!managedOrgId) {
      throw new ForbiddenException("IsManagedOrgInManagerOrg - No managed org id found in request params.");
    }

    return true;
  }
}
