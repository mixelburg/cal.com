import { Module } from "@nestjs/common";
import { OAuthClientWebhooksController } from "@/modules/oauth-clients/controllers/oauth-client-webhooks/oauth-client-webhooks.controller";
import { OAuthClientModule } from "@/modules/oauth-clients/oauth-client.module";

import { MembershipsModule } from "../memberships/memberships.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersModule } from "../users/users.module";
import { WebhooksController } from "./controllers/webhooks.controller";
import { OAuthClientWebhooksService } from "./services/oauth-clients-webhooks.service";
import { UserWebhooksService } from "./services/user-webhooks.service";
import { WebhooksService } from "./services/webhooks.service";
import { WebhooksRepository } from "./webhooks.repository";
import { RedisModule } from "@/modules/redis/redis.module";

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UsersModule,
    OAuthClientModule,
    MembershipsModule,
    OAuthClientModule,
  ],
  controllers: [
    WebhooksController,
    OAuthClientWebhooksController,
  ],
  providers: [
    WebhooksService,
    WebhooksRepository,
    UserWebhooksService,
    OAuthClientWebhooksService,
  ],
  exports: [
    WebhooksService,
    WebhooksRepository,
    UserWebhooksService,
    OAuthClientWebhooksService,
  ],
})
export class WebhooksModule {}
