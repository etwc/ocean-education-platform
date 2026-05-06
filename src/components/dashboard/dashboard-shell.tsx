"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  CalendarCheck2,
  CreditCard,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  KeyRound,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { canAccessRoute, roleHomeCopy, roleLabels } from "@/lib/auth/permissions";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/domain";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quiz Quest", href: "/dashboard/quizzes", icon: Trophy, badge: "Play" },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck2 },
  { label: "Tuition", href: "/dashboard/payments", icon: CreditCard },
  { label: "Progress", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const roleConfig: Record<UserRole, { initials: string; accent: string; icon: LucideIcon }> = {
  admin: { initials: "OA", accent: "from-blue-500 to-indigo-500", icon: ShieldCheck },
  teacher: { initials: "OT", accent: "from-sky-500 to-cyan-400", icon: BookOpenCheck },
  student: { initials: "OS", accent: "from-amber-400 to-sky-400", icon: Sparkles },
};

const roleOptions: UserRole[] = ["student", "teacher", "admin"];
const mobileNavTargets = new Set(["/dashboard", "/dashboard/quizzes", "/dashboard/attendance", "/dashboard/payments", "/dashboard/settings"]);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useDemoRole("student");
  const activeRole = roleConfig[role];
  const RoleIcon = activeRole.icon;
  const visibleNav = navItems.filter((item) => canAccessRoute(role, item.href));
  const hasAccess = canAccessRoute(role, pathname);
  const attendanceActionLabel = role === "student" ? "Check In" : "Generate Attendance";

  async function handleSignOut() {
    window.localStorage.removeItem("ocean-demo-role");
    await createClient()?.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 soft-grid opacity-50" />
      <div className="fixed left-[18%] top-0 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
      <div className="fixed right-0 top-28 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass-panel fixed inset-y-4 left-4 z-30 hidden w-[286px] flex-col rounded-xl p-4 lg:flex"
      >
        <Link href="/dashboard" className="mb-7 flex items-center gap-3 px-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-300/35">
            <Waves className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Ocean Education</p>
            <p className="text-xs text-slate-500">Sunny learning hub</p>
          </div>
        </Link>

        <div className="mb-5 rounded-xl border border-sky-100 bg-white/70 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <RoleIcon className="size-4 text-sky-600" />
            {roleLabels[role]} view
          </div>
          <p className="text-xs leading-5 text-slate-500">{roleHomeCopy[role]}</p>
        </div>

        <nav className="space-y-1.5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-700",
                  isActive && "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-600 hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {item.badge ? (
                  <Badge variant={isActive ? "secondary" : "info"} className={cn(isActive && "bg-white/20 text-white")}>
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Sparkles className="size-4 text-sky-600" />
              Demo role switch
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {roleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={cn(
                    "rounded-lg px-2 py-2 text-xs font-semibold capitalize transition-all",
                    role === option ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-slate-500 hover:bg-sky-50",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white/72 p-3">
            <Avatar>
              <AvatarFallback className={cn("bg-gradient-to-br text-white", activeRole.accent)}>{activeRole.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">Ocean {roleLabels[role]}</p>
              <p className="text-xs text-slate-500">Demo workspace</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Sign out" onClick={handleSignOut}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      <div className="relative z-10 lg:pl-[318px]">
        <header className="sticky top-0 z-20 border-b border-sky-100/80 bg-white/72 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="group flex min-w-0 items-center gap-3 rounded-2xl pr-2 transition-colors hover:text-sky-700"
              aria-label="Go to Ocean Education dashboard"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-200 lg:hidden">
                <Waves className="size-5" />
              </div>
              <div className="hidden size-10 items-center justify-center rounded-xl border border-sky-100 bg-white text-sky-600 lg:flex">
                <Waves className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-sky-700">Ocean Education Platform</p>
                <p className="hidden text-xs text-slate-500 sm:block">{roleLabels[role]} learning workspace</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard/attendance">
                  <KeyRound className="size-4" />
                  {attendanceActionLabel}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5" />
              </Button>
              <Link href="/dashboard/settings" aria-label="Open settings" className="rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-sky-300">
                <Avatar>
                  <AvatarFallback className={cn("bg-gradient-to-br text-white", activeRole.accent)}>{activeRole.initials}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>

        </header>

        <main className="px-4 py-4 pb-28 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">
          {hasAccess ? children : <AccessRestricted role={role} />}
        </main>

        <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-[28px] border border-sky-100 bg-white/90 p-2 shadow-2xl shadow-sky-200/45 backdrop-blur-xl lg:hidden">
          {visibleNav
            .filter((item) => mobileNavTargets.has(item.href))
            .slice(0, 5)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold text-slate-500 transition-colors",
                    isActive && "bg-blue-600 text-white shadow-lg shadow-blue-200",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              );
            })}
        </nav>
      </div>
    </div>
  );
}

function AccessRestricted({ role }: { role: UserRole }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="sunny-card rounded-xl p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <LockKeyhole className="size-7" />
        </div>
        <Badge variant="info" className="mb-4">
          {roleLabels[role]} access
        </Badge>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-900">This area is not available for this role</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">{roleHomeCopy[role]}</p>
        <Button asChild variant="premium" className="mt-6">
          <Link href="/dashboard">Back to my dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
