// Stub for removed EE API key service - self-hosters don't have app-specific API keys
export class ApiKeyService {
  constructor(_deps: any) {}
  
  async verifyKeyByHashedKey(_hashedKey: string): Promise<{
    valid: boolean;
    error?: string;
    userId?: number;
    user?: any;
  }> {
    return {
      valid: false,
      error: "API keys not supported in self-hosted version",
    };
  }
}

