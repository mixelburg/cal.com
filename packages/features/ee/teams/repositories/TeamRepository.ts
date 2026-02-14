// Stub for removed EE TeamRepository - self-hosters have teams but no org/billing features
export class TeamRepository {
  constructor(_prisma: any) {}
  
  async findTeamsByUserId(_params: any): Promise<any[]> {
    return [];
  }
  
  async findFirstBySlugAndParentSlug(_params: any): Promise<{ id: number } | null> {
    return null;
  }
  
  async findById(_params: { id: number } | number): Promise<any | null> {
    return null;
  }
  
  async findByIdWithMembers(_params: { id: number } | number): Promise<any | null> {
    return null;
  }
  
  async findAllByParentId(_params: any): Promise<any[]> {
    return [];
  }

  async findByIdIncludePlatformBilling(_params: { id: number } | number): Promise<any | null> {
    return null;
  }
}
