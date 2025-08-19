import { Role } from "./role";

export interface User {
  email?: string | null;
  name?: string | null;
  avatar?: string | null;
  role?: Role | null;
  userId?: number | null;
}
