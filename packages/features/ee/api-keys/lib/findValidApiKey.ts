// Stub for removed EE API key validation - self-hosters don't have app-specific API keys
export async function findValidApiKey(_hashedApiKey: string, _appSlug?: string): Promise<any | null> {
  return null;
}
