// Stub for removed EE Retell AI service - self-hosters don't have AI phone calls
export class RetellAIService {
  static async createCall(_params: any) {
    throw new Error("AI phone calls not supported in self-hosted version");
  }
}
