// Stub for removed EE mark no-show feature - self-hosters don't have no-show fees
export default async function handleMarkNoShow(_params: any) {
  throw new Error("Mark no-show feature not supported in self-hosted version");
}
