import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsMembershipInOrg implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const membershipId: string = request.params.membershipId;
    const orgId: string = request.params.orgId;

    if (!orgId) {
      throw new ForbiddenException("IsMembershipInOrg - No org id found in request params.");
    }

    if (!membershipId) {
      throw new ForbiddenException("IsMembershipInOrg - No membership id found in request params.");
    }

    return true;
  }
}
