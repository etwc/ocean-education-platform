"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Globe2,
  KeyRound,
  Languages,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { roleLabels } from "@/lib/auth/permissions";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";

type ToggleRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

type ActionRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: string;
  danger?: boolean;
  onClick?: () => void;
};

export function AppSettings() {
  const router = useRouter();
  const { role } = useDemoRole("student");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quizReminders, setQuizReminders] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(false);
  const [sunnyTheme, setSunnyTheme] = useState(true);
  const [language, setLanguage] = useState("English");

  async function handleLogout() {
    window.localStorage.removeItem("ocean-demo-role");
    await createClient()?.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="relative overflow-hidden rounded-xl border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#ffffff_58%,#eef2ff)] p-5 shadow-xl shadow-sky-200/30 sm:p-7">
        <div className="absolute right-8 top-8 size-20 rounded-full bg-white/62 shadow-lg shadow-sky-200/35" />
        <div className="relative flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white">OE</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Badge variant="info" className="mb-2">
              {roleLabels[role]} settings
            </Badge>
            <h1 className="truncate text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">Ocean Education account</h1>
            <p className="mt-1 text-sm text-slate-500">Manage profile, notifications, language, and security.</p>
          </div>
        </div>
      </section>

      <SettingsSection title="Profile">
        <ActionRow icon={UserRound} title="Profile details" description="Name, avatar, class, and display preferences" action="Edit" />
        <ActionRow icon={Mail} title="Email address" description="student@ocean.edu.my" action="Change" />
        <ActionRow icon={ShieldCheck} title="Role access" description={`${roleLabels[role]} permissions are active for this session`} />
      </SettingsSection>

      <SettingsSection title="Account">
        <ActionRow icon={KeyRound} title="Password reset" description="Send a secure reset link through Supabase Auth" action="Send" />
        <ActionRow icon={LockKeyhole} title="Login security" description="Review trusted devices and account activity" action="View" />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <ToggleRow
          icon={Bell}
          title="Email notifications"
          description="Class updates, reminders, and learning summaries"
          checked={emailNotifications}
          onChange={() => setEmailNotifications((value) => !value)}
        />
        <ToggleRow
          icon={Sparkles}
          title="Quiz reminders"
          description="Friendly nudges before new quiz quests"
          checked={quizReminders}
          onChange={() => setQuizReminders((value) => !value)}
        />
        <ToggleRow
          icon={Globe2}
          title="Attendance alerts"
          description={role === "student" ? "Only alerts about your own attendance" : "Alerts for classes you are allowed to view"}
          checked={attendanceAlerts}
          onChange={() => setAttendanceAlerts((value) => !value)}
        />
      </SettingsSection>

      <SettingsSection title="Appearance and language">
        <ToggleRow
          icon={Palette}
          title="Sunny theme"
          description="Bright blue and white learning interface"
          checked={sunnyTheme}
          onChange={() => setSunnyTheme((value) => !value)}
        />
        <div className="flex items-center gap-4 px-4 py-3">
          <SettingIcon icon={Languages} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Language</p>
            <p className="text-xs leading-5 text-slate-500">Choose the app language</p>
          </div>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-10 rounded-xl border border-sky-100 bg-sky-50 px-3 text-sm font-semibold text-sky-700 outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          >
            <option>English</option>
            <option>Bahasa Melayu</option>
            <option>中文</option>
          </select>
        </div>
        <ActionRow icon={Moon} title="Focus mode" description="Reduce visual motion during study sessions" action="Set up" />
      </SettingsSection>

      <div className="rounded-xl border border-rose-100 bg-white/82 p-2 shadow-lg shadow-sky-100">
        <ActionRow icon={LogOut} title="Log out" description="End this demo session" danger onClick={handleLogout} />
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-2 text-xs font-bold uppercase text-slate-400">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-sky-100 bg-white/84 shadow-lg shadow-sky-100">{children}</div>
    </section>
  );
}

function SettingIcon({ icon: Icon, danger }: { icon: LucideIcon; danger?: boolean }) {
  return (
    <div className={cn("flex size-10 items-center justify-center rounded-xl", danger ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-700")}>
      <Icon className="size-5" />
    </div>
  );
}

function ActionRow({ icon, title, description, action, danger, onClick }: ActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-sky-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-sky-50/60"
    >
      <SettingIcon icon={icon} danger={danger} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", danger ? "text-rose-600" : "text-slate-900")}>{title}</p>
        <p className="text-xs leading-5 text-slate-500">{description}</p>
      </div>
      {action ? <span className="text-sm font-semibold text-sky-700">{action}</span> : null}
      <ChevronRight className="size-4 text-slate-300" />
    </button>
  );
}

function ToggleRow({ icon, title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-sky-50 px-4 py-3 last:border-b-0">
      <SettingIcon icon={icon} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative h-7 w-12 rounded-full transition-colors",
          checked ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
