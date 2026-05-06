"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserRole } from "@/types/domain";

type AuthMode = "login" | "register" | "forgot";

type RoleOption = {
  value: UserRole;
  label: string;
  icon: LucideIcon;
};

const roleOptions: RoleOption[] = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "teacher", label: "Teacher", icon: UsersRound },
  { value: "admin", label: "Admin", icon: ShieldCheck },
];

const modeContent = {
  login: {
    eyebrow: "Ocean Education",
    title: "Welcome back",
    copy: "A polished learning cockpit for classes, quizzes, attendance, and progress.",
    cta: "Sign in",
    icon: LockKeyhole,
  },
  register: {
    eyebrow: "Create account",
    title: "Join the learning hub",
    copy: "Role-aware access keeps the MVP simple while still feeling like a real SaaS product.",
    cta: "Create account",
    icon: UserRound,
  },
  forgot: {
    eyebrow: "Password reset",
    title: "Recover access",
    copy: "Send a secure reset email through Supabase Auth.",
    cta: "Send reset link",
    icon: KeyRound,
  },
};

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const content = modeContent[mode];
  const ModeIcon = content.icon;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const supabase = createClient();

    if (!isSupabaseConfigured || !supabase) {
      window.localStorage.setItem("ocean-demo-role", role);
      setStatus({ type: "info", message: "Demo mode is active. Supabase keys can be added anytime." });
      router.push("/dashboard");
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus({ type: "error", message: error.message });
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        setStatus({ type: "error", message: error.message });
        setLoading(false);
        return;
      }

      setStatus({ type: "success", message: "Account created. Check your inbox to confirm your email." });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Reset link sent. Check your inbox." });
    }

    setLoading(false);
  }

  function openDemo(roleValue: UserRole) {
    window.localStorage.setItem("ocean-demo-role", roleValue);
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="absolute inset-0 soft-grid opacity-60" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthHeroPanel />

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="glass-panel rounded-xl p-5 sm:p-7"
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <Badge variant="info" className="mb-4 gap-1.5">
                <ModeIcon className="size-3.5" />
                {content.eyebrow}
              </Badge>
              <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">{content.title}</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">{content.copy}</p>
            </div>
            <div className="hidden rounded-lg border border-sky-100 bg-white/72 p-3 text-sky-600 sm:block">
              <Waves className="size-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" ? (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Nur Aisyah"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@ocean.edu.my"
                  className="pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            {mode !== "forgot" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder="Minimum 6 characters"
                    className="pl-10"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            ) : null}

            {mode === "register" ? (
              <div className="space-y-3">
                <Label>Role</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = option.value === role;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        className={[
                          "flex h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-all",
                          isActive
                            ? "border-blue-300 bg-sky-50 text-sky-700 shadow-lg shadow-sky-100"
                            : "border-border bg-white/70 text-muted-foreground hover:border-sky-300 hover:text-sky-700",
                        ].join(" ")}
                      >
                        <Icon className="size-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {status ? (
              <div
                className={[
                  "rounded-lg border px-4 py-3 text-sm",
                  status.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : status.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-sky-200 bg-sky-50 text-sky-700",
                ].join(" ")}
              >
                {status.message}
              </div>
            ) : null}

            <Button type="submit" variant="premium" size="lg" className="w-full" disabled={loading}>
              {loading ? "Working..." : content.cta}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  className="h-11 justify-start bg-white/70"
                  onClick={() => openDemo(option.value)}
                >
                  <Icon className="size-4" />
                  {option.label} demo
                </Button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                <Link className="font-medium text-sky-700 hover:text-blue-700" href="/forgot-password">
                  Forgot password?
                </Link>
                <span>
                  New here?{" "}
                  <Link className="font-medium text-sky-700 hover:text-blue-700" href="/register">
                    Create account
                  </Link>
                </span>
              </>
            ) : (
              <Link className="font-medium text-sky-700 hover:text-blue-700" href="/login">
                Back to login
              </Link>
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function AuthHeroPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative hidden min-h-[640px] overflow-hidden rounded-xl border border-sky-100 bg-[linear-gradient(135deg,#dcf7ff,#ffffff_54%,#eef2ff)] p-7 shadow-xl shadow-sky-200/35 lg:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.34),transparent_26rem),radial-gradient(circle_at_85%_12%,rgba(199,210,254,0.38),transparent_22rem)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-xl shadow-blue-200">
              <Waves className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Ocean Education</p>
              <p className="text-xs text-slate-500">Malaysia learning center</p>
            </div>
          </div>
          <Badge variant="success" className="gap-1.5">
            <Sparkles className="size-3.5" />
            MVP Preview
          </Badge>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/72 px-3 py-1 text-xs font-semibold text-sky-700">
            <Zap className="size-3.5" />
            Quiz XP, attendance, progress, reports
          </p>
          <h2 className="text-5xl font-semibold leading-[1.04] tracking-normal text-slate-950 text-balance">
            A learning platform that feels alive from the first click.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Built for a bright education demo: smooth auth, role-based dashboards, and a strong visual foundation for gamified learning.
          </p>
        </div>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl border border-sky-100 bg-white/72 p-4 shadow-lg shadow-sky-100 backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Today attendance</span>
              <CheckCircle2 className="size-5 text-emerald-300" />
            </div>
            <div className="text-4xl font-semibold text-slate-950">91%</div>
            <Progress value={91} className="mt-4 bg-sky-100" />
            <p className="mt-3 text-xs text-slate-500">7 classes checked in</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl border border-sky-100 bg-white/72 p-4 shadow-lg shadow-sky-100 backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Quiz leaderboard</span>
              <Trophy className="size-5 text-amber-200" />
            </div>
            {["Aisyah", "Daniel", "Mei Lin"].map((name, index) => (
              <div key={name} className="mb-3 flex items-center gap-3 last:mb-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-slate-900">{name}</span>
                    <span className="text-sky-700">{980 - index * 80} XP</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-100">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#a78bfa)]"
                      style={{ width: `${92 - index * 14}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
