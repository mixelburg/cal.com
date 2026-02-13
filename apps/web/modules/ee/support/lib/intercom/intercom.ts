// Stub for removed EE Intercom types and client
export type Contact = {
  id: string;
  email?: string;
};

export const intercom = {
  conversations: {
    create: async (_data: any) => ({ id: "stub" }),
  },
};
