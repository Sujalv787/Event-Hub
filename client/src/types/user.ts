export type UserRole = "USER" | "ORGANIZER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
