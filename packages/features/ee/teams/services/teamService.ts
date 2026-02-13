// Stub for removed EE teamService
export class TeamService {
  static async getTeamMembers(_teamId: number): Promise<any[]> {
    return [];
  }
  
  static async getTeam(_teamId: number): Promise<any | null> {
    return null;
  }
  
  static async acceptInvitationByToken(_token: string, _userId: number): Promise<void> {}
  
  static async inviteMemberByToken(_token: string, _userId: number): Promise<string> {
    return "";
  }
  
  static async fetchTeamOrThrow(_params: any): Promise<any> {
    throw new Error("Team not found");
  }
}
