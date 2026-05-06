import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types/domain";

const roles: UserRole[] = ["admin", "teacher", "student"];

export function readUserRole(user: User | null): UserRole {
  const rawRole = user?.user_metadata?.role ?? user?.app_metadata?.role;

  if (typeof rawRole === "string" && roles.includes(rawRole as UserRole)) {
    return rawRole as UserRole;
  }

  return "student";
}
