import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { HttpError } from "@calcom/lib/http-error";
import logger from "@calcom/lib/logger";
import type { OAuthReq } from "@calcom/types/oauth";

// Stub for removed EE jackson SSO
const jackson = async () => ({
  oauthController: {
    authorize: async (_params: any) => ({ redirect_url: null }),
  },
});

async function handler(req: NextRequest) {
  const log = logger.getSubLogger({ prefix: ["[SAML authorize]"] });
  const { oauthController } = await jackson();

  const oAuthReq = Object.fromEntries(req.nextUrl.searchParams) as unknown as OAuthReq;

  try {
    const { redirect_url } = await oauthController.authorize(oAuthReq);

    return NextResponse.redirect(redirect_url as string, 302);
  } catch (err) {
    log.error(`Error initaiting SAML login for tenant ${oAuthReq?.tenant}: ${err}`);
    const { message, statusCode = 500 } = err as HttpError;

    return NextResponse.json({ message }, { status: statusCode });
  }
}

export const GET = defaultResponderForAppDir(handler);

export const dynamic = "force-dynamic";
