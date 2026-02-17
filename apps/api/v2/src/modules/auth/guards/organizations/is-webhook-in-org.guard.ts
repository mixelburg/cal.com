import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class IsWebhookInOrg implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const webhookId: string = request.params.webhookId;
    const organizationId: string = request.params.orgId;

    if (!organizationId) {
      throw new ForbiddenException("IsWebhookInOrg - No organization id found in request params.");
    }
    if (!webhookId) {
      throw new ForbiddenException("IsWebhookInOrg - No webhook id found in request params.");
    }

    return true;
  }
}
