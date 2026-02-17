import { MembershipsModule } from "@/modules/memberships/memberships.module";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { RedisModule } from "@/modules/redis/redis.module";
import { TeamsMembershipsController } from "@/modules/teams/memberships/controllers/teams-memberships.controller";
import { TeamsMembershipsService } from "@/modules/teams/memberships/services/teams-memberships.service";
import { TeamsMembershipsRepository } from "@/modules/teams/memberships/teams-memberships.repository";
import { TeamsModule } from "@/modules/teams/teams/teams.module";
import { UsersModule } from "@/modules/users/users.module";
import { Logger, Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    MembershipsModule,
    TeamsModule,
    UsersModule,
  ],
  providers: [TeamsMembershipsRepository, TeamsMembershipsService, Logger],
  controllers: [TeamsMembershipsController],
  exports: [TeamsMembershipsService],
})
export class TeamsMembershipsModule {}
