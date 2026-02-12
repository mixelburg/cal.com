import { DI_TOKENS } from "@calcom/features/di/tokens";

import { createModule } from "../di";

// Stub for removed EE TeamRepository
class TeamRepository {
  constructor(_prisma: any) {}
}

export const teamRepositoryModule = createModule();
teamRepositoryModule.bind(DI_TOKENS.TEAM_REPOSITORY).toClass(TeamRepository, [DI_TOKENS.PRISMA_CLIENT]);
