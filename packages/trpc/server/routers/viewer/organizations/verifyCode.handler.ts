// Stub for removed EE organization verification - self-hosters don't have organizations
type VerifyCodeOptions = {
  ctx: any;
  input: any;
};

export const verifyCodeHandler = async ({ ctx, input }: VerifyCodeOptions) => {
  throw new Error("Organization verification not supported in self-hosted version");
};
