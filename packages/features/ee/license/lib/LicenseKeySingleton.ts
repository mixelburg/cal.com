// Stub for removed EE license key validation - self-hosters don't need licenses
export class LicenseKeySingleton {
  static async getInstance(_repo: any) {
    return {
      checkLicense: async () => true, // Self-hosters always pass license check
    };
  }
}
