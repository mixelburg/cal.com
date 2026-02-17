import { Reflector } from "@nestjs/core";

export type PlatformPlanType = "STARTER" | "ESSENTIALS" | "SCALE";

export const PlatformPlan = Reflector.createDecorator<PlatformPlanType>();
