import { DI_TOKENS } from "@calcom/features/di/tokens";

import { createModule } from "../di";

import { TeamRepository } from "@calcom/features/ee/teams/repositories/TeamRepository";

export const teamRepositoryModule = createModule();
teamRepositoryModule.bind(DI_TOKENS.TEAM_REPOSITORY).toClass(TeamRepository, [DI_TOKENS.PRISMA_CLIENT]);
