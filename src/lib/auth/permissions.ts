import type { UserRole } from "@/types/domain";

export type PermissionRoute =
  | "/dashboard"
  | "/dashboard/quizzes"
  | "/dashboard/attendance"
  | "/dashboard/payments"
  | "/dashboard/reports"
  | "/dashboard/settings";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};

export const roleHomeCopy: Record<UserRole, string> = {
  admin: "Full center overview, teachers, attendance, tuition history, and system settings.",
  teacher: "Class schedules, attendance, results, tuition visibility, and quiz coaching tools.",
  student: "Your own classes, attendance, tuition status, academic results, and daily learning tasks.",
};

export const roleAllowedRoutes: Record<UserRole, PermissionRoute[]> = {
  student: ["/dashboard", "/dashboard/quizzes", "/dashboard/attendance", "/dashboard/payments", "/dashboard/reports", "/dashboard/settings"],
  teacher: ["/dashboard", "/dashboard/quizzes", "/dashboard/attendance", "/dashboard/payments", "/dashboard/reports", "/dashboard/settings"],
  admin: [
    "/dashboard",
    "/dashboard/quizzes",
    "/dashboard/attendance",
    "/dashboard/payments",
    "/dashboard/settings",
  ],
};

export function canAccessRoute(role: UserRole, route: string) {
  return roleAllowedRoutes[role].some((allowedRoute) => route === allowedRoute);
}

export function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "teacher" || value === "student";
}
