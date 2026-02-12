import type { TrpcSessionUser } from "@calcom/trpc/server/types";

// Stub for removed EE DueInvoiceService
class DueInvoiceService {
  async getBannerDataForUser(_userId: number): Promise<any> {
    return null;
  }
}

type Props = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const getDueInvoiceBannerDataHandler = async ({ ctx }: Props) => {
  const dueInvoiceService = new DueInvoiceService();
  return await dueInvoiceService.getBannerDataForUser(ctx.user.id);
};
