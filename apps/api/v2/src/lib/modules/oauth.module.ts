import { OAuthService } from "@/lib/services/oauth.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}

export const oAuthServiceModule = OAuthModule;
