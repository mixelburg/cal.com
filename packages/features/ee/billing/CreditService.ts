// Stub for removed EE billing credit service
export class CreditService {
  async hasCredit(_userId: number) {
    return false;
  }
  async consumeCredit(_userId: number, _creditType: any) {
    return;
  }
}
