"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Hash,
  KeyRound,
  RotateCcw,
  Timer,
  XCircle,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/domain";

type AttendanceStatus = "Present" | "Absent" | "Late";

type AttendanceStudent = {
  id: string;
  name: string;
  status: AttendanceStatus;
};

type ClassAttendance = {
  id: string;
  subject: string;
  formLevel: string;
  teacher: string;
  teacherId: string;
  badgeClass: string;
  students: AttendanceStudent[];
};

type AttendanceHistoryItem = {
  subject: string;
  status: AttendanceStatus;
  date: string;
  time: string;
};

type SubjectBreakdown = {
  subject: string;
  percentage: number;
  attended: number;
  total: number;
  tone: string;
};

type AttendanceCounts = {
  present: number;
  absent: number;
  late: number;
};

type AttendanceSession = {
  classId: string;
  code: string;
  isActive: boolean;
};

const DEMO_TEACHER_ID = "teacher-daniel";
const ATTENDANCE_CODE_STORAGE_KEY = "ocean-active-attendance-session";
const DEFAULT_ATTENDANCE_SESSION: AttendanceSession = {
  classId: "form-3-math",
  code: "482731",
  isActive: true,
};

const initialClassAttendance: ClassAttendance[] = [
  {
    id: "form-3-math",
    subject: "Mathematics",
    formLevel: "Form 3",
    teacher: "Mr. Daniel",
    teacherId: DEMO_TEACHER_ID,
    badgeClass: "border-blue-100 bg-blue-50 text-blue-700",
    students: [
      { id: "aisyah", name: "Aisyah", status: "Present" },
      { id: "jason", name: "Jason", status: "Present" },
      { id: "sarah", name: "Sarah", status: "Absent" },
      { id: "daniel", name: "Daniel", status: "Late" },
      { id: "mei-lin", name: "Mei Lin", status: "Present" },
      { id: "amir", name: "Amir", status: "Present" },
    ],
  },
  {
    id: "form-2-english",
    subject: "English",
    formLevel: "Form 2",
    teacher: "Mr. Daniel",
    teacherId: DEMO_TEACHER_ID,
    badgeClass: "border-indigo-100 bg-indigo-50 text-indigo-700",
    students: [
      { id: "aiden", name: "Aiden", status: "Present" },
      { id: "sofia", name: "Sofia", status: "Late" },
      { id: "hana", name: "Hana", status: "Present" },
      { id: "kevin", name: "Kevin", status: "Absent" },
      { id: "farah", name: "Farah", status: "Present" },
      { id: "zara", name: "Zara", status: "Present" },
    ],
  },
  {
    id: "form-4-science",
    subject: "Science",
    formLevel: "Form 4",
    teacher: "Teacher Lim",
    teacherId: "teacher-lim",
    badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
    students: [
      { id: "nora", name: "Nora", status: "Present" },
      { id: "ethan", name: "Ethan", status: "Present" },
      { id: "siti", name: "Siti", status: "Present" },
      { id: "ryan", name: "Ryan", status: "Late" },
      { id: "chloe", name: "Chloe", status: "Present" },
      { id: "harith", name: "Harith", status: "Absent" },
    ],
  },
];

const studentHistory: AttendanceHistoryItem[] = [
  { subject: "Mathematics", status: "Present", date: "May 7, 2026", time: "9:00 AM" },
  { subject: "English", status: "Present", date: "May 6, 2026", time: "11:00 AM" },
  { subject: "Science", status: "Late", date: "May 5, 2026", time: "2:00 PM" },
  { subject: "Mathematics", status: "Present", date: "May 4, 2026", time: "9:00 AM" },
  { subject: "English", status: "Absent", date: "May 3, 2026", time: "11:00 AM" },
  { subject: "Science", status: "Present", date: "May 2, 2026", time: "2:00 PM" },
];

const subjectBreakdown: SubjectBreakdown[] = [
  { subject: "Mathematics", percentage: 92, attended: 23, total: 25, tone: "text-blue-700" },
  { subject: "English", percentage: 88, attended: 22, total: 25, tone: "text-indigo-700" },
  { subject: "Science", percentage: 95, attended: 19, total: 20, tone: "text-emerald-700" },
];

const attendanceStatuses: AttendanceStatus[] = ["Present", "Absent", "Late"];

export function AttendanceModule() {
  const { role } = useDemoRole("student");

  if (role === "student") {
    return <StudentAttendanceView />;
  }

  return <AttendanceManagementView role={role} />;
}

function AttendanceManagementView({ role }: { role: Extract<UserRole, "teacher" | "admin"> }) {
  const [classes, setClasses] = useState<ClassAttendance[]>(initialClassAttendance);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<AttendanceSession>(DEFAULT_ATTENDANCE_SESSION);
  const [secondsLeft, setSecondsLeft] = useState(252);
  const visibleClasses = role === "teacher" ? classes.filter((classItem) => classItem.teacherId === DEMO_TEACHER_ID) : classes;
  const selectedClass = visibleClasses.find((classItem) => classItem.id === selectedClassId);
  const activeClass = visibleClasses.find((classItem) => classItem.id === activeSession.classId) ?? visibleClasses[0];
  const expiresAt = useMemo(() => formatCountdown(secondsLeft), [secondsLeft]);

  useEffect(() => {
    const savedSession = loadAttendanceSession();

    if (savedSession) {
      setActiveSession(savedSession);
    }
  }, []);

  useEffect(() => {
    saveAttendanceSession(activeSession);
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession.isActive || secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [activeSession.isActive, secondsLeft]);

  function updateStudentStatus(classId: string, studentId: string, status: AttendanceStatus) {
    setClasses((currentClasses) =>
      currentClasses.map((classItem) => {
        if (classItem.id !== classId) {
          return classItem;
        }

        return {
          ...classItem,
          students: classItem.students.map((student) => (student.id === studentId ? { ...student, status } : student)),
        };
      }),
    );
  }

  function regenerateAttendanceCode() {
    const nextSession = {
      classId: activeClass.id,
      code: generateAttendanceCode(),
      isActive: true,
    };

    setActiveSession(nextSession);
    setSecondsLeft(300);
  }

  function endAttendanceSession() {
    setActiveSession((currentSession) => ({ ...currentSession, isActive: false }));
  }

  if (selectedClass) {
    return (
      <ClassAttendanceDetail
        classItem={selectedClass}
        role={role}
        onBack={() => setSelectedClassId(null)}
        onUpdateStatus={updateStudentStatus}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-6">
      <AttendanceHero
        role={role}
        title="Attendance Management"
        subtitle={
          role === "teacher"
            ? "Manage attendance for your own classes and update student status in real time."
            : "Manage attendance across every class, teacher, and form."
        }
      />

      <AttendanceCodeGenerator
        activeClass={activeClass}
        session={activeSession}
        expiresAt={expiresAt}
        onRegenerate={regenerateAttendanceCode}
        onEndSession={endAttendanceSession}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Class attendance overview</h2>
          <p className="text-sm text-slate-500">
            {role === "teacher" ? "Only classes assigned to you are shown." : "Admin can view and manage all class attendance."}
          </p>
        </div>
        {role === "admin" ? <AdminExportActions classes={visibleClasses} /> : null}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleClasses.map((classItem, index) => (
          <AttendanceClassCard
            key={classItem.id}
            classItem={classItem}
            index={index}
            onClick={() => setSelectedClassId(classItem.id)}
          />
        ))}
      </section>
    </div>
  );
}

function AttendanceCodeGenerator({
  activeClass,
  session,
  expiresAt,
  onRegenerate,
  onEndSession,
}: {
  activeClass: ClassAttendance;
  session: AttendanceSession;
  expiresAt: string;
  onRegenerate: () => void;
  onEndSession: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.04 }}
      className="sunny-card rounded-[28px] p-5 sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Badge variant={session.isActive ? "success" : "warning"}>{session.isActive ? "Attendance Active" : "Session Ended"}</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            {activeClass.formLevel} {activeClass.subject}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Students enter this 6-digit code to check in. Manual editing is still available below.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="min-h-12" onClick={onRegenerate}>
              <RotateCcw className="size-4" />
              Regenerate code
            </Button>
            <Button variant="destructive" className="min-h-12" onClick={onEndSession} disabled={!session.isActive}>
              End session
            </Button>
          </div>
        </div>

        <div className="rounded-[26px] border border-blue-100 bg-[linear-gradient(135deg,#eff8ff,#ffffff)] p-5 text-center shadow-lg shadow-sky-200/30">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Hash className="size-6" />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Code</p>
          <div className={cn("mt-2 font-mono text-5xl font-bold tracking-[0.2em] sm:text-6xl", session.isActive ? "text-blue-700" : "text-slate-300")}>
            {session.code}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
            <Timer className="size-4 text-sky-600" />
            {session.isActive ? `Expires in ${expiresAt}` : "Session not accepting check-ins"}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AttendanceClassCard({ classItem, index, onClick }: { classItem: ClassAttendance; index: number; onClick: () => void }) {
  const counts = getAttendanceCounts(classItem.students);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={onClick}
      className="group w-full rounded-[28px] border border-sky-100 bg-white/88 p-5 text-left shadow-xl shadow-sky-200/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-200/45"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", classItem.badgeClass)}>{classItem.subject}</span>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            {classItem.formLevel} {classItem.subject}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{classItem.teacher}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <BookOpenCheck className="size-5" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniCount label="Present" value={counts.present} tone="text-emerald-700" />
        <MiniCount label="Absent" value={counts.absent} tone="text-rose-700" />
        <MiniCount label="Late" value={counts.late} tone="text-amber-700" />
      </div>
    </motion.button>
  );
}

function ClassAttendanceDetail({
  classItem,
  role,
  onBack,
  onUpdateStatus,
}: {
  classItem: ClassAttendance;
  role: Extract<UserRole, "teacher" | "admin">;
  onBack: () => void;
  onUpdateStatus: (classId: string, studentId: string, status: AttendanceStatus) => void;
}) {
  const counts = getAttendanceCounts(classItem.students);

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <button type="button" onClick={onBack} className="flex min-h-11 items-center gap-2 rounded-2xl px-2 text-sm font-semibold text-sky-700">
        <ArrowLeft className="size-4" />
        Back to attendance overview
      </button>

      <section className="sunny-card rounded-[28px] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", classItem.badgeClass)}>{classItem.subject}</span>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
              {classItem.formLevel} {classItem.subject}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{classItem.teacher} attendance list</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{role} editing</Badge>
            {role === "admin" ? <ClassExportActions classItem={classItem} /> : null}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <MiniCount label="Total Present" value={counts.present} tone="text-emerald-700" />
          <MiniCount label="Total Absent" value={counts.absent} tone="text-rose-700" />
          <MiniCount label="Total Late" value={counts.late} tone="text-amber-700" />
        </div>

        <div className="space-y-3">
          {classItem.students.map((student) => (
            <EditableStudentAttendanceRow
              key={student.id}
              student={student}
              onChangeStatus={(status) => onUpdateStatus(classItem.id, student.id, status)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function EditableStudentAttendanceRow({
  student,
  onChangeStatus,
}: {
  student: AttendanceStudent;
  onChangeStatus: (status: AttendanceStatus) => void;
}) {
  const statusConfig = getStatusConfig(student.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      className="rounded-[24px] border border-sky-100 bg-white/88 p-4 shadow-sm transition-all hover:shadow-lg hover:shadow-sky-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", statusConfig.iconClass)}>
            <StatusIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-950">{student.name}</p>
            <p className="mt-1 text-sm text-slate-500">Current status: {student.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[300px]">
          {attendanceStatuses.map((status) => (
            <StatusEditBadge key={status} status={status} isActive={student.status === status} onClick={() => onChangeStatus(status)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatusEditBadge({
  status,
  isActive,
  onClick,
}: {
  status: AttendanceStatus;
  isActive: boolean;
  onClick: () => void;
}) {
  const statusConfig = getStatusConfig(status);

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-2xl border px-3 text-xs font-bold transition-all",
        isActive
          ? cn(statusConfig.activeClass, "shadow-sm")
          : "border-sky-100 bg-sky-50/60 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
      )}
    >
      {status}
    </button>
  );
}

function StudentAttendanceView() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [personalRecords, setPersonalRecords] = useState<AttendanceHistoryItem[]>(studentHistory);
  const [activeSession, setActiveSession] = useState<AttendanceSession>(DEFAULT_ATTENDANCE_SESSION);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join("");
  const canSubmit = code.length === 6;
  const activeClass = initialClassAttendance.find((classItem) => classItem.id === activeSession.classId) ?? initialClassAttendance[0];
  const present = personalRecords.filter((item) => item.status === "Present").length;
  const late = personalRecords.filter((item) => item.status === "Late").length;
  const attendanceRate = Math.round(((present + late) / personalRecords.length) * 100);

  useEffect(() => {
    const savedSession = loadAttendanceSession();

    if (savedSession) {
      setActiveSession(savedSession);
    }
  }, []);

  function updateDigit(index: number, value: string) {
    const nextDigit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextDigit;
    setDigits(nextDigits);
    setFeedback(null);

    if (nextDigit && index < digits.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleBackspace(index: number) {
    if (digits[index]) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      return;
    }

    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(value: string) {
    const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");

    if (pastedDigits.length === 0) {
      return;
    }

    const nextDigits = ["", "", "", "", "", ""];
    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setDigits(nextDigits);
    setFeedback(null);
    inputsRef.current[Math.min(pastedDigits.length, 5)]?.focus();
  }

  function submitAttendanceCode() {
    if (!canSubmit) {
      return;
    }

    if (!activeSession.isActive) {
      setFeedback({ type: "error", message: "This attendance session has ended. Please ask your teacher for a new code." });
      return;
    }

    if (code !== activeSession.code) {
      setFeedback({ type: "error", message: "Invalid attendance code. Please check the 6-digit code and try again." });
      return;
    }

    const checkInTime = new Date().toLocaleTimeString("en-MY", { hour: "numeric", minute: "2-digit" });
    setPersonalRecords((records) => [
      {
        subject: activeClass.subject,
        status: "Present",
        date: "Today",
        time: checkInTime,
      },
      ...records,
    ]);
    setFeedback({
      type: "success",
      message: `Attendance marked for ${activeClass.formLevel} ${activeClass.subject}.`,
    });
    setDigits(["", "", "", "", "", ""]);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="sunny-card rounded-[28px] p-5 sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <KeyRound className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-950">Attendance Check-In</h1>
              <p className="text-sm text-slate-500">Enter the 6-digit code provided by your teacher.</p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <motion.input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                whileFocus={{ y: -2, scale: 1.03 }}
                value={digit}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Attendance code digit ${index + 1}`}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleBackspace(index);
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  handlePaste(event.clipboardData.getData("text"));
                }}
                className="h-14 rounded-2xl border border-sky-100 bg-white text-center text-xl font-bold text-slate-950 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:h-16 sm:text-2xl"
              />
            ))}
          </div>

          <Button onClick={submitAttendanceCode} disabled={!canSubmit} variant="premium" size="lg" className="mt-6 min-h-12 w-full">
            Submit attendance
          </Button>

          {feedback ? (
            <div
              className={cn(
                "mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium",
                feedback.type === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700",
              )}
            >
              {feedback.type === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          ) : null}
        </motion.div>

        <section className="sunny-card rounded-[28px] p-5 sm:p-6">
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <Badge variant="info" className="mb-4 gap-1.5">
                <CalendarCheck2 className="size-3.5" />
                My attendance
              </Badge>
              <h2 className="text-2xl font-semibold text-slate-950">Personal attendance records</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Students can submit attendance codes and view only their own records.
              </p>
            </div>

            <div className="rounded-[26px] border border-blue-100 bg-[linear-gradient(135deg,#eff8ff,#ffffff)] p-5 text-center shadow-lg shadow-sky-200/30">
              <p className="text-xs font-bold uppercase text-slate-400">Attendance rate</p>
              <p className="mt-1 text-4xl font-bold text-blue-700">{attendanceRate}%</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">This term</p>
            </div>
          </div>
        </section>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="sunny-card rounded-[28px] p-5">
          <SectionHeader icon={BarChart3} title="Subject attendance" description="Your own attendance percentage by subject." />
          <div className="space-y-4">
            {subjectBreakdown.map((item) => (
              <SubjectProgressRow key={item.subject} item={item} />
            ))}
          </div>
        </div>

        <div className="sunny-card rounded-[28px] p-5">
          <SectionHeader icon={CalendarCheck2} title="Recent records" description="Latest attendance records from your classes." />
          <div className="space-y-3">
            {personalRecords.map((item) => (
              <AttendanceHistoryCard key={`${item.subject}-${item.date}-${item.time}`} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AttendanceHero({ role, title, subtitle }: { role: UserRole; title: string; subtitle: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#eef6ff_52%,#ffffff)] p-5 shadow-xl shadow-sky-200/35 sm:p-7"
    >
      <div className="absolute right-6 top-6 size-20 rounded-[28px] bg-white/60 shadow-lg shadow-sky-200/35" />
      <div className="relative">
        <Badge variant="info" className="mb-4 gap-1.5">
          <GraduationCap className="size-3.5" />
          {role} attendance
        </Badge>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p>
      </div>
    </motion.section>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
        <Icon className="size-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SubjectProgressRow({ item }: { item: SubjectBreakdown }) {
  return (
    <div className="rounded-[22px] border border-sky-100 bg-white/86 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{item.subject}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {item.attended}/{item.total} attended
          </p>
        </div>
        <span className={cn("text-xl font-bold", item.tone)}>{item.percentage}%</span>
      </div>
      <Progress value={item.percentage} className="bg-sky-50" />
    </div>
  );
}

function AttendanceHistoryCard({ item }: { item: AttendanceHistoryItem }) {
  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-sky-100 bg-white/86 p-4">
      <div className={cn("flex size-11 items-center justify-center rounded-2xl", statusConfig.iconClass)}>
        <StatusIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">{item.subject}</p>
        <p className="text-sm text-slate-500">
          {item.date} - {item.time}
        </p>
      </div>
      <Badge variant={statusConfig.badgeVariant}>{item.status}</Badge>
    </div>
  );
}

function MiniCount({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-sky-50/70 p-3 text-center">
      <p className={cn("text-xl font-bold", tone)}>{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function AdminExportActions({ classes }: { classes: ClassAttendance[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => exportClassesAsPrintablePdf(classes)}>
        <Download className="size-4" />
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => exportClassesAsExcel(classes)}>
        <FileSpreadsheet className="size-4" />
        Export Excel
      </Button>
    </div>
  );
}

function ClassExportActions({ classItem }: { classItem: ClassAttendance }) {
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => exportClassesAsPrintablePdf([classItem])}>
        <Download className="size-4" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => exportClassesAsExcel([classItem])}>
        <FileSpreadsheet className="size-4" />
        Excel
      </Button>
    </>
  );
}

function getAttendanceCounts(students: AttendanceStudent[]): AttendanceCounts {
  return students.reduce(
    (counts, student) => {
      if (student.status === "Present") {
        return { ...counts, present: counts.present + 1 };
      }

      if (student.status === "Absent") {
        return { ...counts, absent: counts.absent + 1 };
      }

      return { ...counts, late: counts.late + 1 };
    },
    { present: 0, absent: 0, late: 0 },
  );
}

function getStatusConfig(status: AttendanceStatus) {
  if (status === "Present") {
    return {
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
      activeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      badgeVariant: "success" as const,
    };
  }

  if (status === "Late") {
    return {
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
      activeClass: "border-amber-200 bg-amber-50 text-amber-700",
      badgeVariant: "warning" as const,
    };
  }

  return {
    icon: XCircle,
    iconClass: "bg-rose-50 text-rose-600",
    activeClass: "border-rose-200 bg-rose-50 text-rose-700",
    badgeVariant: "outline" as const,
  };
}

function generateAttendanceCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatCountdown(secondsLeft: number) {
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function loadAttendanceSession(): AttendanceSession | null {
  const savedSession = window.localStorage.getItem(ATTENDANCE_CODE_STORAGE_KEY);

  if (!savedSession) {
    return DEFAULT_ATTENDANCE_SESSION;
  }

  try {
    const parsedSession = JSON.parse(savedSession) as Partial<AttendanceSession>;

    if (
      typeof parsedSession.classId === "string" &&
      typeof parsedSession.code === "string" &&
      parsedSession.code.length === 6 &&
      typeof parsedSession.isActive === "boolean"
    ) {
      return {
        classId: parsedSession.classId,
        code: parsedSession.code,
        isActive: parsedSession.isActive,
      };
    }
  } catch {
    return DEFAULT_ATTENDANCE_SESSION;
  }

  return DEFAULT_ATTENDANCE_SESSION;
}

function saveAttendanceSession(session: AttendanceSession) {
  window.localStorage.setItem(ATTENDANCE_CODE_STORAGE_KEY, JSON.stringify(session));
}

function exportClassesAsExcel(classes: ClassAttendance[]) {
  const rows = classes.flatMap((classItem) =>
    classItem.students.map((student) => ({
      className: `${classItem.formLevel} ${classItem.subject}`,
      subject: classItem.subject,
      teacher: classItem.teacher,
      form: classItem.formLevel,
      student: student.name,
      status: student.status,
    })),
  );
  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.className)}</td>
          <td>${escapeHtml(row.subject)}</td>
          <td>${escapeHtml(row.teacher)}</td>
          <td>${escapeHtml(row.form)}</td>
          <td>${escapeHtml(row.student)}</td>
          <td>${escapeHtml(row.status)}</td>
        </tr>
      `,
    )
    .join("");
  const worksheet = `
    <html>
      <body>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Form</th>
              <th>Student</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  downloadFile("ocean-attendance-records.xls", worksheet, "application/vnd.ms-excel");
}

function exportClassesAsPrintablePdf(classes: ClassAttendance[]) {
  const classSections = classes
    .map((classItem) => {
      const counts = getAttendanceCounts(classItem.students);
      const rows = classItem.students
        .map(
          (student) => `
            <tr>
              <td>${escapeHtml(student.name)}</td>
              <td>${escapeHtml(student.status)}</td>
            </tr>
          `,
        )
        .join("");

      return `
        <section>
          <h2>${escapeHtml(classItem.formLevel)} ${escapeHtml(classItem.subject)}</h2>
          <p>${escapeHtml(classItem.teacher)}</p>
          <p>Present: ${counts.present} | Absent: ${counts.absent} | Late: ${counts.late}</p>
          <table>
            <thead><tr><th>Student</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Ocean Education Attendance Report</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; }
          h1 { margin: 0 0 24px; }
          h2 { margin: 24px 0 4px; }
          p { color: #475569; margin: 4px 0 12px; }
          table { border-collapse: collapse; width: 100%; margin: 12px 0 24px; }
          th, td { border: 1px solid #dbeafe; padding: 10px; text-align: left; }
          th { background: #eff6ff; }
        </style>
      </head>
      <body>
        <h1>Ocean Education Attendance Report</h1>
        ${classSections}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
