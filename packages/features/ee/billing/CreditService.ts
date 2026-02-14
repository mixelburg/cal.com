// Stub for removed EE billing credit service - self-hosters don't have credits
export class CreditService {
  async hasCredit(_userId: number) {
    return false;
  }
  async consumeCredit(_userId: number, _creditType: any) {
    return;
  }
  async hasAvailableCredits(_userId: number) {
    return false;
  }
}
