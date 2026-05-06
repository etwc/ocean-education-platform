export type UserRole = "admin" | "teacher" | "student";

export type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "blue" | "violet" | "emerald" | "amber";
};

export type ActivityItem = {
  title: string;
  meta: string;
  status: "live" | "done" | "pending";
};
