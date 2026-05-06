"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck2,
  Clock3,
  CreditCard,
  GraduationCap,
  MapPin,
  PlayCircle,
  Star,
  Trophy,
  UserRound,
  UsersRound,
  Video,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/auth/permissions";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/domain";

type LearningOverviewCard = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: string;
};

type ClassScheduleItem = {
  time: string;
  title: string;
  location: string;
  teacher: string;
  subject: string;
  mode: "room" | "online";
  badgeClass: string;
  status?: "Live now" | "Next class";
};

type AssessmentItem = {
  subject: string;
  title: string;
  date: string;
  time: string;
  detail: string;
  xp: string;
  status: string;
  badgeClass: string;
  action: string;
};

const roleHero: Record<UserRole, { title: string; subtitle: string; cta: string }> = {
  student: {
    title: "Welcome back, Aisyah 👋",
    subtitle: "Continue your learning journey today. Your next class and assessments are ready.",
    cta: "Start learning",
  },
  teacher: {
    title: "Welcome back, Teacher Lim 👋",
    subtitle: "Your classes, students, and upcoming assessments are organized for today.",
    cta: "Open quiz quest",
  },
  admin: {
    title: "Welcome back, Ocean team 👋",
    subtitle: "A calm overview of classes, attendance, tuition status, and upcoming learning activity.",
    cta: "Review platform",
  },
};

const overviewCards: Record<UserRole, LearningOverviewCard[]> = {
  student: [
    { label: "XP", value: "12,480", helper: "+320 today", icon: Star, tone: "from-sky-50 to-blue-50 text-sky-700" },
    { label: "Level", value: "8", helper: "640 XP to Level 9", icon: Trophy, tone: "from-indigo-50 to-sky-50 text-indigo-700" },
    { label: "Attendance", value: "94%", helper: "Your own record", icon: CalendarCheck2, tone: "from-emerald-50 to-sky-50 text-emerald-700" },
    { label: "Tuition", value: "Paid", helper: "May cleared", icon: CreditCard, tone: "from-amber-50 to-sky-50 text-amber-700" },
  ],
  teacher: [
    { label: "Students", value: "86", helper: "4 classes", icon: UsersRound, tone: "from-sky-50 to-blue-50 text-sky-700" },
    { label: "Level checks", value: "24", helper: "Need review", icon: Trophy, tone: "from-indigo-50 to-sky-50 text-indigo-700" },
    { label: "Attendance", value: "91%", helper: "Class view", icon: CalendarCheck2, tone: "from-emerald-50 to-sky-50 text-emerald-700" },
    { label: "Assessments", value: "5", helper: "Scheduled", icon: BookOpenCheck, tone: "from-amber-50 to-sky-50 text-amber-700" },
  ],
  admin: [
    { label: "Students", value: "428", helper: "All centers", icon: UsersRound, tone: "from-sky-50 to-blue-50 text-sky-700" },
    { label: "Teachers", value: "18", helper: "6 subjects", icon: GraduationCap, tone: "from-indigo-50 to-sky-50 text-indigo-700" },
    { label: "Attendance", value: "91%", helper: "Today average", icon: CalendarCheck2, tone: "from-emerald-50 to-sky-50 text-emerald-700" },
    { label: "Tuition", value: "86%", helper: "Paid this month", icon: CreditCard, tone: "from-amber-50 to-sky-50 text-amber-700" },
  ],
};

const classSchedules: Record<UserRole, ClassScheduleItem[]> = {
  student: [
    {
      time: "9:00 AM",
      title: "Mathematics",
      location: "Room A-02",
      teacher: "Mr. Daniel",
      subject: "Math",
      mode: "room",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
      status: "Next class",
    },
    {
      time: "11:00 AM",
      title: "English Speaking",
      location: "Online Class",
      teacher: "Ms. Priya",
      subject: "English",
      mode: "online",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      status: "Live now",
    },
    {
      time: "2:00 PM",
      title: "Science Revision",
      location: "Room B-01",
      teacher: "Teacher Lim",
      subject: "Science",
      mode: "room",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ],
  teacher: [
    {
      time: "9:00 AM",
      title: "Form 3 Mathematics",
      location: "Room A-02",
      teacher: "32 students",
      subject: "Math",
      mode: "room",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
      status: "Next class",
    },
    {
      time: "11:00 AM",
      title: "English Speaking Group",
      location: "Online Class",
      teacher: "24 students",
      subject: "English",
      mode: "online",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      status: "Live now",
    },
    {
      time: "2:00 PM",
      title: "Science Revision",
      location: "Room B-01",
      teacher: "30 students",
      subject: "Science",
      mode: "room",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ],
  admin: [
    {
      time: "9:00 AM",
      title: "Mathematics",
      location: "Room A-02",
      teacher: "Mr. Daniel",
      subject: "Math",
      mode: "room",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
      status: "Next class",
    },
    {
      time: "11:00 AM",
      title: "English Speaking",
      location: "Online Class",
      teacher: "Ms. Priya",
      subject: "English",
      mode: "online",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      status: "Live now",
    },
    {
      time: "2:00 PM",
      title: "Science Revision",
      location: "Room B-01",
      teacher: "Teacher Lim",
      subject: "Science",
      mode: "room",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ],
};

const assessments: Record<UserRole, AssessmentItem[]> = {
  student: [
    {
      subject: "English",
      title: "English Vocabulary Test",
      date: "May 12",
      time: "2:00 PM",
      detail: "15 questions",
      xp: "+150 XP",
      status: "Due in 6 days",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      action: "Start Review",
    },
    {
      subject: "Science",
      title: "Science Monthly Assessment",
      date: "May 14",
      time: "10:00 AM",
      detail: "Chapter 5 - 7",
      xp: "+220 XP",
      status: "This week",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      action: "Review Notes",
    },
  ],
  teacher: [
    {
      subject: "English",
      title: "English Vocabulary Test",
      date: "May 12",
      time: "2:00 PM",
      detail: "15 questions",
      xp: "86 students",
      status: "Ready",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      action: "Manage",
    },
    {
      subject: "Science",
      title: "Science Monthly Assessment",
      date: "May 14",
      time: "10:00 AM",
      detail: "Chapter 5 - 7",
      xp: "3 classes",
      status: "Draft",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      action: "Edit",
    },
  ],
  admin: [
    {
      subject: "English",
      title: "English Vocabulary Test",
      date: "May 12",
      time: "2:00 PM",
      detail: "15 questions",
      xp: "86 students",
      status: "Ready",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      action: "View",
    },
    {
      subject: "Science",
      title: "Science Monthly Assessment",
      date: "May 14",
      time: "10:00 AM",
      detail: "Chapter 5 - 7",
      xp: "All centers",
      status: "Scheduled",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      action: "View",
    },
  ],
};

export function DashboardOverview() {
  const { role } = useDemoRole("student");
  const hero = roleHero[role];

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-6 sm:space-y-6">
      <HeroSection role={role} hero={hero} />
      <LearningOverview cards={overviewCards[role]} />

      <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <ClassSchedule role={role} items={classSchedules[role]} />
        <UpcomingAssessments role={role} items={assessments[role]} />
      </section>
    </div>
  );
}

function HeroSection({ role, hero }: { role: UserRole; hero: { title: string; subtitle: string; cta: string } }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#eef6ff_52%,#ffffff)] p-5 shadow-xl shadow-sky-200/35 sm:p-7"
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 top-7 size-20 rounded-[28px] bg-white/60 shadow-lg shadow-sky-200/35 sm:right-10 sm:size-24"
      />
      <motion.div
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-7 right-32 size-10 rounded-2xl bg-sky-300/45 sm:size-12"
      />

      <div className="relative max-w-2xl">
        <Badge variant="info" className="mb-4 gap-1.5">
          <Waves className="size-3.5" />
          {roleLabels[role]} LMS
        </Badge>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal text-slate-950 text-balance sm:text-5xl">{hero.title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">{hero.subtitle}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="premium" size="lg" className="min-h-12 w-full sm:w-auto">
            <Link href="/dashboard/quizzes">
              <PlayCircle className="size-4" />
              {hero.cta}
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg" className="min-h-12 w-full sm:w-auto">
            <Link href="/dashboard/reports">
              View progress
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

function LearningOverview({ cards }: { cards: LearningOverviewCard[] }) {
  return (
    <section>
      <SectionHeader title="Learning overview" description="A quick snapshot you can scan on the go." />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4">
        {cards.map((card, index) => (
          <OverviewCard key={card.label} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}

function OverviewCard({ card, index }: { card: LearningOverviewCard; index: number }) {
  const Icon = card.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.04 }}
      className={cn(
        "min-w-[158px] snap-start rounded-[22px] border border-sky-100 bg-gradient-to-br p-4 shadow-lg shadow-sky-100 transition-all sm:min-w-0",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-100",
        card.tone,
      )}
    >
      <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-white/78 shadow-sm">
        <Icon className="size-5" />
      </div>
      <p className="text-xs font-semibold uppercase text-slate-500">{card.label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">{card.value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{card.helper}</p>
    </motion.article>
  );
}

function ClassSchedule({ role, items }: { role: UserRole; items: ClassScheduleItem[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06 }}
      className="sunny-card rounded-[28px] p-4 sm:p-5"
    >
      <SectionHeader
        title="Upcoming classes"
        description={role === "student" ? "Your personal schedule for today." : "Class schedule preview for today."}
        action={<Badge variant="info">Today</Badge>}
      />

      <div className="space-y-0">
        {items.map((classItem, index) => (
          <ClassTimelineCard
            key={`${classItem.time}-${classItem.title}`}
            item={classItem}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </motion.section>
  );
}

function ClassTimelineCard({ item, isLast }: { item: ClassScheduleItem; isLast: boolean }) {
  const LocationIcon = item.mode === "online" ? Video : MapPin;
  const isNext = item.status === "Next class";

  return (
    <div className="grid grid-cols-[70px_22px_1fr] gap-3 sm:grid-cols-[82px_26px_1fr]">
      <div className="pt-4 text-right text-sm font-semibold text-slate-500">{item.time}</div>

      <div className="relative flex justify-center">
        {!isLast ? <div className="absolute top-9 h-full w-px bg-sky-100" /> : null}
        <div className={cn("relative mt-4 size-4 rounded-full border-4 border-white shadow-md", isNext ? "bg-blue-600 shadow-blue-200" : "bg-sky-300 shadow-sky-100")} />
      </div>

      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18 }}
        className={cn(
          "mb-3 rounded-[22px] border bg-white/86 p-4 shadow-sm transition-all hover:shadow-lg hover:shadow-sky-100",
          isNext ? "border-blue-200 ring-4 ring-blue-50" : "border-sky-100",
        )}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", item.badgeClass)}>{item.subject}</span>
          {item.status ? <Badge variant={item.status === "Live now" ? "success" : "info"}>{item.status}</Badge> : null}
        </div>

        <h3 className="text-base font-semibold text-slate-950 sm:text-lg">{item.title}</h3>

        <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <LocationIcon className="size-4 text-sky-600" />
            {item.location}
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 text-sky-600" />
            {item.teacher}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function UpcomingAssessments({ role, items }: { role: UserRole; items: AssessmentItem[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="sunny-card rounded-[28px] p-4 sm:p-5"
    >
      <SectionHeader
        title="Upcoming assessments"
        description={role === "student" ? "Your next deadlines and review tasks." : "Assessment schedule and management."}
        action={<Clock3 className="size-5 text-sky-600" />}
      />

      <div className="space-y-3">
        {items.map((assessment, index) => (
          <AssessmentCard key={`${assessment.subject}-${assessment.title}`} assessment={assessment} index={index} />
        ))}
      </div>
    </motion.section>
  );
}

function AssessmentCard({ assessment, index }: { assessment: AssessmentItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-[22px] border border-sky-100 bg-white/86 p-4 shadow-sm transition-all hover:shadow-lg hover:shadow-sky-100"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", assessment.badgeClass)}>{assessment.subject}</span>
        <Badge variant="warning">{assessment.status}</Badge>
      </div>

      <h3 className="text-base font-semibold leading-6 text-slate-950">{assessment.title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {assessment.date} - {assessment.time}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">{assessment.detail}</span>
        <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">{assessment.xp}</span>
      </div>

      <Button variant="outline" size="sm" className="mt-4 min-h-10 w-full justify-center sm:w-auto">
        {assessment.action}
      </Button>
    </motion.article>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
