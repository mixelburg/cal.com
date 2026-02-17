import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuthService {
  async getClient(clientId: string) {
    return { clientId };
  }

  async handleTokenRequest(_clientId: string, _body: unknown) {
    return {
      access_token: "",
      token_type: "Bearer",
      expires_in: 0,
      refresh_token: "",
      scope: "",
    };
  }

  buildErrorRedirectUrl(redirectUri: string, _error: unknown, _state?: string) {
    return redirectUri;
  }
}
