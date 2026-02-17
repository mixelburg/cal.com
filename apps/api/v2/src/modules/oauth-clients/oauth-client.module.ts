import { AppsRepository } from "@/modules/apps/apps.repository";
import { AuthModule } from "@/modules/auth/auth.module";
import { CredentialsRepository } from "@/modules/credentials/credentials.repository";
import { MembershipsModule } from "@/modules/memberships/memberships.module";
import { OAuthClientUsersController } from "@/modules/oauth-clients/controllers/oauth-client-users/oauth-client-users.controller";
import { OAuthFlowController } from "@/modules/oauth-clients/controllers/oauth-flow/oauth-flow.controller";
import { OAuthClientRepository } from "@/modules/oauth-clients/oauth-client.repository";
import { OAuthClientUsersOutputService } from "@/modules/oauth-clients/services/oauth-clients-users-output.service";
import { OAuthClientUsersService } from "@/modules/oauth-clients/services/oauth-clients-users.service";
import { OAuthClientsInputService } from "@/modules/oauth-clients/services/oauth-clients/oauth-clients-input.service";
import { OAuthClientsOutputService } from "@/modules/oauth-clients/services/oauth-clients/oauth-clients-output.service";
import { OAuthClientsService } from "@/modules/oauth-clients/services/oauth-clients/oauth-clients.service";
import { OAuthFlowService } from "@/modules/oauth-clients/services/oauth-flow.service";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { RedisModule } from "@/modules/redis/redis.module";
import { StripeModule } from "@/modules/stripe/stripe.module";
import { TokensModule } from "@/modules/tokens/tokens.module";
import { TokensRepository } from "@/modules/tokens/tokens.repository";
import { UsersModule } from "@/modules/users/users.module";
import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    TokensModule,
    MembershipsModule,
    StripeModule,
  ],
  providers: [
    OAuthClientRepository,
    TokensRepository,
    OAuthFlowService,
    CredentialsRepository,
    AppsRepository,
    OAuthClientUsersService,
    OAuthClientsService,
    OAuthClientsInputService,
    OAuthClientsOutputService,
    JwtService,
    OAuthClientUsersOutputService,
  ],
  controllers: [OAuthClientUsersController, OAuthFlowController],
  exports: [OAuthClientRepository, OAuthClientsOutputService, OAuthClientUsersOutputService],
})
export class OAuthClientModule {}
