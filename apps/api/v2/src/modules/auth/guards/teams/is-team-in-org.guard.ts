import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsTeamInOrg implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const teamId: string = request.params.teamId;
    const orgId: string = request.params.orgId;

    if (!orgId) {
      throw new ForbiddenException("IsTeamInOrg - No org id found in request params.");
    }

    if (!teamId) {
      throw new ForbiddenException("IsTeamInOrg - No team id found in request params.");
    }

    return true;
  }
}
