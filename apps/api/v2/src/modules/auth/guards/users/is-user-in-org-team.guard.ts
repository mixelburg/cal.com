import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsUserInOrgTeam implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const teamId: string = request.params.teamId;
    const orgId: string = request.params.orgId;
    const userId: string = request.params.userId;

    if (!userId) {
      throw new ForbiddenException("IsUserInOrgTeam - No user id found in request params.");
    }

    if (!orgId) {
      throw new ForbiddenException("IsUserInOrgTeam - No org id found in request params.");
    }

    if (!teamId) {
      throw new ForbiddenException("IsUserInOrgTeam - No team id found in request params.");
    }

    return true;
  }
}
