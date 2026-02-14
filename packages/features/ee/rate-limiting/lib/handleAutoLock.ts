// Stub for removed EE auto-lock feature - self-hosters don't have auto-locking
export async function handleAutoLock(_params: any): Promise<boolean> {
  return false; // Never lock
}
