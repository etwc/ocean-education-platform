"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Save,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadAcademicReportPdf, type AcademicReportSubject } from "@/lib/reports/pdf";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";

type StudentResult = AcademicReportSubject & {
  id: string;
};

type ExamHistory = {
  name: string;
  date: string;
};

type TeacherScoreRow = {
  id: string;
  student: string;
  math: number;
  english: number;
  science: number;
  remarks: string;
};

const studentResults: StudentResult[] = [
  {
    id: "math",
    subject: "Mathematics",
    score: 92,
    total: 100,
    grade: "A",
    remarks: "Excellent improvement",
  },
  {
    id: "english",
    subject: "English",
    score: 85,
    total: 100,
    grade: "B+",
    remarks: "Good writing skills",
  },
  {
    id: "science",
    subject: "Science",
    score: 88,
    total: 100,
    grade: "A-",
    remarks: "Consistent performance",
  },
];

const examHistory: ExamHistory[] = [
  { name: "Mid Year Assessment", date: "May 2026" },
  { name: "Monthly Test", date: "April 2026" },
  { name: "Final Assessment", date: "March 2026" },
];

const initialTeacherRows: TeacherScoreRow[] = [
  { id: "aisyah", student: "Aisyah", math: 92, english: 85, science: 88, remarks: "Excellent improvement" },
  { id: "jason", student: "Jason", math: 75, english: 82, science: 90, remarks: "Strong science performance" },
  { id: "sarah", student: "Sarah", math: 89, english: 91, science: 87, remarks: "Very consistent work" },
];

export function AcademicReportModule() {
  const { role } = useDemoRole("student");

  if (role === "teacher") {
    return <TeacherReportView />;
  }

  return <StudentReportView />;
}

function StudentReportView() {
  const average = useMemo(
    () => Math.round(studentResults.reduce((sum, result) => sum + result.score, 0) / studentResults.length),
    [],
  );

  function downloadReport() {
    downloadAcademicReportPdf({
      schoolName: "Ocean Education",
      studentName: "Aisyah",
      examName: "Mid Year Assessment",
      generatedAt: "May 2026",
      subjects: studentResults,
    });
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5 pb-6">
      <AcademicOverview average={average} />

      <section className="sunny-card rounded-[28px] p-4 sm:p-5">
        <SectionHeader title="Subject results" description="Your own academic results and teacher remarks." />
        <div className="grid gap-3 md:grid-cols-3">
          {studentResults.map((result, index) => (
            <SubjectResultCard key={result.id} result={result} index={index} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <ExamHistoryCard exams={examHistory} />
        <DownloadReportCard onDownload={downloadReport} />
      </section>
    </main>
  );
}

function TeacherReportView() {
  const [rows, setRows] = useState<TeacherScoreRow[]>(initialTeacherRows);
  const [message, setMessage] = useState<string | null>(null);

  function updateScore(rowId: string, key: "math" | "english" | "science", value: string) {
    const numericValue = Math.max(0, Math.min(100, Number(value) || 0));
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, [key]: numericValue } : row)));
  }

  function updateRemark(rowId: string, value: string) {
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, remarks: value } : row)));
  }

  function addStudentScore() {
    setRows((current) => [
      ...current,
      {
        id: `student-${current.length + 1}`,
        student: "New Student",
        math: 0,
        english: 0,
        science: 0,
        remarks: "Add teacher remark",
      },
    ]);
  }

  function saveResults() {
    setMessage("Results saved for demo. Supabase student_results can connect here later.");
  }

  function generatePdf(row: TeacherScoreRow) {
    downloadAcademicReportPdf({
      schoolName: "Ocean Education",
      studentName: row.student,
      examName: "Mid Year Assessment",
      generatedAt: "May 2026",
      subjects: [
        { subject: "Mathematics", score: row.math, total: 100, grade: gradeFromScore(row.math), remarks: row.remarks },
        { subject: "English", score: row.english, total: 100, grade: gradeFromScore(row.english), remarks: row.remarks },
        { subject: "Science", score: row.science, total: 100, grade: gradeFromScore(row.science), remarks: row.remarks },
      ],
    });
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 pb-6">
      <section className="sunny-card rounded-[28px] p-4 sm:p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="info" className="mb-3">Teacher results</Badge>
            <h1 className="text-2xl font-semibold text-slate-950">Score management</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">Enter scores, update grades, add remarks, and generate academic PDF reports.</p>
          </div>
          <Button variant="premium" className="min-h-11" onClick={addStudentScore}>
            <Edit3 className="size-4" />
            Add Score
          </Button>
        </div>

        <div className="space-y-3">
          <div className="hidden rounded-2xl bg-sky-50 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid lg:grid-cols-[1.1fr_0.6fr_0.6fr_0.6fr_1.2fr_0.9fr] lg:gap-3">
            <span>Student</span>
            <span>Math</span>
            <span>English</span>
            <span>Science</span>
            <span>Teacher remark</span>
            <span>Actions</span>
          </div>
          {rows.map((row) => (
            <TeacherScoreRowCard
              key={row.id}
              row={row}
              onScoreChange={updateScore}
              onRemarkChange={updateRemark}
              onGeneratePdf={generatePdf}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="premium" className="min-h-12" onClick={saveResults}>
            <Save className="size-4" />
            Save Results
          </Button>
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}

function AcademicOverview({ average }: { average: number }) {
  return (
    <section className="sunny-card rounded-[28px] p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <Badge variant="info" className="mb-3">Academic Overview</Badge>
          <h1 className="text-2xl font-semibold text-slate-950">Mid Year Assessment</h1>
          <p className="mt-1 text-sm text-slate-500">Your latest academic report card.</p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <GraduationCap className="size-6" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <OverviewPill label="Overall Average" value={`${average}%`} />
        <OverviewPill label="Latest Exam" value="Mid Year" />
        <OverviewPill label="Status" value="Good Progress" success />
      </div>
    </section>
  );
}

function SubjectResultCard({ result, index }: { result: StudentResult; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-[24px] border border-sky-100 bg-white/86 p-4 shadow-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{result.subject}</p>
          <p className="mt-1 text-sm text-slate-500">Teacher Remark</p>
        </div>
        <Badge variant="info">Grade {result.grade}</Badge>
      </div>
      <p className="text-3xl font-bold text-slate-950">{result.score} / {result.total}</p>
      <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-600">&quot;{result.remarks}&quot;</p>
    </motion.article>
  );
}

function ExamHistoryCard({ exams }: { exams: ExamHistory[] }) {
  return (
    <section className="sunny-card rounded-[28px] p-4 sm:p-5">
      <SectionHeader title="Recent exams" description="Your exam history." />
      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={`${exam.name}-${exam.date}`} className="flex items-center gap-3 rounded-[22px] border border-sky-100 bg-white/86 p-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-950">{exam.name}</p>
              <p className="text-sm text-slate-500">{exam.date}</p>
            </div>
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
        ))}
      </div>
    </section>
  );
}

function DownloadReportCard({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="sunny-card rounded-[28px] p-4 sm:p-5">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Download className="size-6" />
      </div>
      <h2 className="text-lg font-semibold text-slate-950">Download report</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Generate a clean PDF report with Ocean Education branding, scores, grades, and teacher remarks.</p>
      <Button variant="premium" className="mt-5 min-h-12 w-full" onClick={onDownload}>
        <Download className="size-4" />
        Download PDF Report
      </Button>
    </section>
  );
}

function TeacherScoreRowCard({
  row,
  onScoreChange,
  onRemarkChange,
  onGeneratePdf,
}: {
  row: TeacherScoreRow;
  onScoreChange: (rowId: string, key: "math" | "english" | "science", value: string) => void;
  onRemarkChange: (rowId: string, value: string) => void;
  onGeneratePdf: (row: TeacherScoreRow) => void;
}) {
  return (
    <article className="rounded-[24px] border border-sky-100 bg-white/86 p-4 shadow-sm lg:grid lg:grid-cols-[1.1fr_0.6fr_0.6fr_0.6fr_1.2fr_0.9fr] lg:items-center lg:gap-3">
      <div className="mb-3 flex items-center gap-3 lg:mb-0">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <UserRound className="size-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">{row.student}</p>
          <p className="text-xs text-slate-500">Mid Year Assessment</p>
        </div>
      </div>

      <ScoreInput label="Math" value={row.math} onChange={(value) => onScoreChange(row.id, "math", value)} />
      <ScoreInput label="English" value={row.english} onChange={(value) => onScoreChange(row.id, "english", value)} />
      <ScoreInput label="Science" value={row.science} onChange={(value) => onScoreChange(row.id, "science", value)} />

      <label className="mt-3 block lg:mt-0">
        <span className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">Remark</span>
        <input
          value={row.remarks}
          onChange={(event) => onRemarkChange(row.id, event.target.value)}
          className="h-11 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />
      </label>

      <Button variant="outline" className="mt-3 min-h-11 w-full lg:mt-0" onClick={() => onGeneratePdf(row)}>
        <Download className="size-4" />
        Generate PDF
      </Button>
    </article>
  );
}

function ScoreInput({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block lg:mt-0">
      <span className="mb-1 block text-xs font-semibold text-slate-500 lg:hidden">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function OverviewPill({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white/86 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className={cn("mt-1 text-xl font-bold", success ? "text-emerald-700" : "text-slate-950")}>{value}</p>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function gradeFromScore(score: number) {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  return "C";
}
