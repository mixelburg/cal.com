import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsUserInOrg implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const orgId: string = request.params.orgId;
    const userId: string = request.params.userId;

    if (!userId) {
      throw new ForbiddenException("IsUserInOrg - No user id found in request params.");
    }

    if (!orgId) {
      throw new ForbiddenException("IsUserInOrg - No org id found in request params.");
    }

    return true;
  }
}
