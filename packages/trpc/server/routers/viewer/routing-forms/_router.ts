import { z } from "zod";

import authedProcedure from "../../../procedures/authedProcedure";
import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";
import { ZResponseInputSchema } from "./response.schema";

const NAMESPACE = "routingForms";

const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const routingFormsRouter = router({
  public: router({
    response: publicProcedure.input(ZResponseInputSchema).mutation(async ({ ctx, input }) => {
      const { default: handler } = await import("./response.handler");
      return handler({ ctx, input });
    }),
  }),
  // EE attribute-routing endpoint is intentionally unavailable in self-hosted builds.
  findTeamMembersMatchingAttributeLogicOfRoute: publicProcedure
    .input(z.any())
    .mutation(async () => ({
      isUsingAttributeWeights: false,
      teamMembersMatchingAttributeLogic: [],
      eventTypeRedirectUrl: null as string | null,
      contactOwnerEmail: null as string | null,
      result: null as any,
      checkedFallback: false,
      mainWarnings: [],
      fallbackWarnings: [],
    })),
});
