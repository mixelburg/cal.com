import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsOrgGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const organizationId: string = request.params.orgId;

    if (!organizationId) {
      throw new ForbiddenException("IsOrgGuard - No organization id found in request params.");
    }

    return true;
  }
}
