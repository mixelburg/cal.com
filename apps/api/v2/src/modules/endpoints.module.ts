import { OAuth2Module } from "@/modules/auth/oauth2/oauth2.module";
import { ConferencingModule } from "@/modules/conferencing/conferencing.module";
import { OAuthClientModule } from "@/modules/oauth-clients/oauth-client.module";
import { RouterModule } from "@/modules/router/router.module";
import { StripeModule } from "@/modules/stripe/stripe.module";
import { TimezoneModule } from "@/modules/timezones/timezones.module";
import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { WebhooksModule } from "./webhooks/webhooks.module";

@Module({
  imports: [
    OAuth2Module,
    OAuthClientModule,
    TimezoneModule,
    UsersModule,
    WebhooksModule,
    StripeModule,
    ConferencingModule,
    RouterModule,
  ],
})
export class EndpointsModule implements NestModule {
   
  configure(_consumer: MiddlewareConsumer) {
    // TODO: apply ratelimits
  }
}
