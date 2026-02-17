import { PlatformPlan } from "@/modules/auth/decorators/billing/platform-plan.decorator";
import { ApiAuthGuardUser } from "@/modules/auth/strategies/api-auth/api-auth.strategy";
import type { PlatformPlanType } from "@/modules/auth/decorators/billing/platform-plan.decorator";
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class PlatformPlanGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minimumPlan = this.reflector.get(PlatformPlan, context.getHandler()) as PlatformPlanType;
    if (!minimumPlan) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ApiAuthGuardUser;
    if (!user) {
      throw new ForbiddenException("PlatformPlanGuard - No user associated with the request.");
    }
    return true;
  }

  async checkPlatformPlanAccess(_orgId: string, _minimumPlan: PlatformPlanType) {
    return true;
  }
}

type HasMinimumPlanProp = {
  currentPlan: PlatformPlanType;
  minimumPlan: PlatformPlanType;
  plans: readonly PlatformPlanType[];
};

export function hasMinimumPlan(props: HasMinimumPlanProp): boolean {
  const currentPlanIndex = props.plans.indexOf(props.currentPlan);
  const minimumPlanIndex = props.plans.indexOf(props.minimumPlan);

  if (currentPlanIndex === -1 || minimumPlanIndex === -1) {
    throw new ForbiddenException(
      `PlatformPlanGuard - Invalid platform billing plan provided. Current plan: ${props.currentPlan}, Minimum plan: ${props.minimumPlan}`
    );
  }

  return currentPlanIndex >= minimumPlanIndex;
}
