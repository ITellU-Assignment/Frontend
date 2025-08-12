
export type Invite = {
  id: number;
  teacher: { name: string; email: string };
  student: { name: string; email: string };
  scheduledAt: string;
  status: 'pending' | 'accepted' | 'rejected';
};
