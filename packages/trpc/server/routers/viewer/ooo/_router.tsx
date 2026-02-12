import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";

export const oooRouter = router({
    .input(ZOutOfOfficeInputSchema)
    .mutation(async ({ ctx, input }) => {
      return handler({ ctx, input });
    }),
    return handler({ ctx, input });
  }),
    return handler(opts);
  }),
    return handler();
  }),
});
