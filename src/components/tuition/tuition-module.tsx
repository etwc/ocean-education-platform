"use client";

import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  Loader2,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPaymentRedirect } from "@/lib/payments/gateway";
import { useDemoRole } from "@/hooks/use-demo-role";
import { cn } from "@/lib/utils";

type TuitionStatus = "paid" | "pending" | "overdue";

type TuitionRecord = {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  amount: number;
  status: TuitionStatus;
  paymentLink: string | null;
  paidAt: string | null;
  dueDate: string;
};

const studentRecords: TuitionRecord[] = [
  {
    id: "tuition-may-2026",
    studentId: "stu-aisyah",
    studentName: "Aisyah",
    month: "May 2026",
    amount: 450,
    status: "pending",
    paymentLink: null,
    paidAt: null,
    dueDate: "May 15, 2026",
  },
  {
    id: "tuition-apr-2026",
    studentId: "stu-aisyah",
    studentName: "Aisyah",
    month: "April 2026",
    amount: 450,
    status: "paid",
    paymentLink: "demo-paid-april",
    paidAt: "April 3",
    dueDate: "April 15, 2026",
  },
  {
    id: "tuition-mar-2026",
    studentId: "stu-aisyah",
    studentName: "Aisyah",
    month: "March 2026",
    amount: 450,
    status: "paid",
    paymentLink: "demo-paid-march",
    paidAt: "March 2",
    dueDate: "March 15, 2026",
  },
];

const initialAdminRecords: TuitionRecord[] = [
  ...studentRecords,
  {
    id: "tuition-jason-may-2026",
    studentId: "stu-jason",
    studentName: "Jason",
    month: "May 2026",
    amount: 450,
    status: "pending",
    paymentLink: null,
    paidAt: null,
    dueDate: "May 15, 2026",
  },
  {
    id: "tuition-sarah-may-2026",
    studentId: "stu-sarah",
    studentName: "Sarah",
    month: "May 2026",
    amount: 450,
    status: "overdue",
    paymentLink: null,
    paidAt: null,
    dueDate: "May 1, 2026",
  },
  {
    id: "tuition-daniel-may-2026",
    studentId: "stu-daniel",
    studentName: "Daniel",
    month: "May 2026",
    amount: 450,
    status: "paid",
    paymentLink: "demo-paid-daniel",
    paidAt: "May 4",
    dueDate: "May 15, 2026",
  },
];

export function TuitionModule() {
  const { role } = useDemoRole("student");

  if (role === "admin") {
    return <AdminTuitionView />;
  }

  if (role === "teacher") {
    return <TeacherTuitionView />;
  }

  return <StudentTuitionView />;
}

function StudentTuitionView() {
  const currentRecord = studentRecords[0];
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePayNow() {
    setIsRedirecting(true);
    setMessage("Redirecting to payment gateway...");

    await createPaymentRedirect({
      recordId: currentRecord.id,
      amount: currentRecord.amount,
      description: `${currentRecord.month} tuition`,
      returnUrl: "/dashboard/payments",
    });

    window.setTimeout(() => {
      setIsRedirecting(false);
      setMessage("Demo gateway ready. FPX or card integration can be connected here later.");
    }, 650);
  }

  return (
    <main className="mx-auto max-w-4xl space-y-5 pb-6">
      <CurrentTuitionCard record={currentRecord} isRedirecting={isRedirecting} message={message} onPayNow={handlePayNow} />
      <PaymentHistory records={studentRecords} title="Payment history" description="Your own tuition records only." />
    </main>
  );
}

function TeacherTuitionView() {
  const records = initialAdminRecords.filter((record) => record.month === "May 2026");

  return (
    <main className="mx-auto max-w-4xl space-y-5 pb-6">
      <TuitionHeader
        eyebrow="Teacher view"
        title="Student tuition status"
        description="Read-only payment status for your students. Finance actions stay with admins."
        icon={UserRound}
      />
      <section className="sunny-card rounded-[28px] p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">May 2026 status</h2>
          <p className="text-sm text-slate-500">Simple visibility, no finance controls.</p>
        </div>
        <div className="space-y-3">
          {records.map((record) => (
            <TeacherStatusRow key={record.id} record={record} />
          ))}
        </div>
      </section>
    </main>
  );
}

function AdminTuitionView() {
  const [records, setRecords] = useState<TuitionRecord[]>(initialAdminRecords);

  const totals = useMemo(() => {
    return records.reduce(
      (acc, record) => {
        acc[record.status] += 1;
        return acc;
      },
      { paid: 0, pending: 0, overdue: 0 },
    );
  }, [records]);

  function updateStatus(id: string, status: TuitionStatus) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status,
              paidAt: status === "paid" ? "May 6" : null,
            }
          : record,
      ),
    );
  }

  function updateAmount(id: string) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              amount: record.amount === 450 ? 480 : 450,
            }
          : record,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 pb-6">
      <TuitionHeader
        eyebrow="Admin view"
        title="Tuition management"
        description="Simple records for payment status, amounts, and future gateway integration."
        icon={ShieldCheck}
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <AdminSummary label="Paid" value={totals.paid} tone="text-emerald-700" />
        <AdminSummary label="Pending" value={totals.pending} tone="text-amber-700" />
        <AdminSummary label="Overdue" value={totals.overdue} tone="text-rose-700" />
      </section>

      <section className="sunny-card rounded-[28px] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">All tuition records</h2>
            <p className="text-sm text-slate-500">Mock data shaped like future tuition_records rows.</p>
          </div>
          <Badge variant="info">Gateway-ready</Badge>
        </div>

        <div className="space-y-3">
          {records.map((record) => (
            <AdminRecordCard key={record.id} record={record} onUpdateStatus={updateStatus} onUpdateAmount={updateAmount} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CurrentTuitionCard({
  record,
  isRedirecting,
  message,
  onPayNow,
}: {
  record: TuitionRecord;
  isRedirecting: boolean;
  message: string | null;
  onPayNow: () => void;
}) {
  const status = getStatusMeta(record.status);
  const StatusIcon = status.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#eef6ff_52%,#ffffff)] p-5 shadow-xl shadow-sky-200/35 sm:p-6"
    >
      <div className="absolute right-5 top-5 size-20 rounded-[28px] bg-white/60 shadow-lg shadow-sky-200/35" />
      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <Badge variant="info" className="mb-3">Student payment center</Badge>
            <h1 className="text-2xl font-semibold text-slate-950">{record.month} Tuition</h1>
            <p className="mt-1 text-sm text-slate-500">Your current tuition status and due date.</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-sky-700">
            <WalletCards className="size-6" />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/76 p-5">
          <p className="text-sm font-semibold text-slate-500">Amount due</p>
          <p className="mt-1 text-4xl font-bold tracking-normal text-slate-950">RM {record.amount}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoPill label="Status" value={status.label} icon={StatusIcon} tone={status.textClass} />
            <InfoPill label="Due date" value={record.dueDate} icon={Bell} tone="text-sky-700" />
          </div>

          <Button variant="premium" size="lg" className="mt-5 min-h-12 w-full" onClick={onPayNow} disabled={isRedirecting}>
            {isRedirecting ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            Pay Now
          </Button>

          {message ? <p className="mt-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">{message}</p> : null}
        </div>
      </div>
    </motion.section>
  );
}

function PaymentHistory({ records, title, description }: { records: TuitionRecord[]; title: string; description: string }) {
  return (
    <section className="sunny-card rounded-[28px] p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-3">
        {records.map((record) => (
          <TransactionRow key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}

function TransactionRow({ record }: { record: TuitionRecord }) {
  const status = getStatusMeta(record.status);
  const StatusIcon = status.icon;

  return (
    <motion.article
      whileTap={{ scale: 0.99 }}
      whileHover={{ y: -2 }}
      className="flex min-h-20 items-center gap-3 rounded-[24px] border border-sky-100 bg-white/86 p-4 shadow-sm transition-all hover:shadow-lg hover:shadow-sky-100"
    >
      <div className={cn("flex size-11 items-center justify-center rounded-2xl", status.iconClass)}>
        <StatusIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">{record.month}</p>
        <p className="mt-1 text-sm text-slate-500">
          {record.status === "paid" ? `Paid on ${record.paidAt}` : `Due ${record.dueDate}`}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-950">RM {record.amount}</p>
        <p className={cn("mt-1 text-xs font-semibold", status.textClass)}>{status.label}</p>
      </div>
      <ChevronRight className="size-4 text-slate-300" />
    </motion.article>
  );
}

function TeacherStatusRow({ record }: { record: TuitionRecord }) {
  const status = getStatusMeta(record.status);
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-sky-100 bg-white/86 p-4">
      <div className={cn("flex size-11 items-center justify-center rounded-2xl", status.iconClass)}>
        <StatusIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">{record.studentName}</p>
        <p className="text-sm text-slate-500">{record.month} tuition</p>
      </div>
      <Badge variant={status.badgeVariant}>{status.label}</Badge>
    </div>
  );
}

function AdminRecordCard({
  record,
  onUpdateStatus,
  onUpdateAmount,
}: {
  record: TuitionRecord;
  onUpdateStatus: (id: string, status: TuitionStatus) => void;
  onUpdateAmount: (id: string) => void;
}) {
  const status = getStatusMeta(record.status);

  return (
    <article className="rounded-[24px] border border-sky-100 bg-white/86 p-4 shadow-sm">
      <div className="mb-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr] sm:items-center">
        <div>
          <p className="font-semibold text-slate-950">{record.studentName}</p>
          <p className="text-sm text-slate-500">{record.studentId}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Month</p>
          <p className="text-sm font-semibold text-slate-800">{record.month}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Amount</p>
          <p className="text-sm font-semibold text-slate-800">RM {record.amount}</p>
        </div>
        <div className="sm:text-right">
          <Badge variant={status.badgeVariant}>{status.label}</Badge>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="outline" size="sm" className="min-h-10" onClick={() => onUpdateStatus(record.id, "paid")}>
          <CheckCircle2 className="size-4" />
          Mark Paid
        </Button>
        <Button variant="outline" size="sm" className="min-h-10" onClick={() => onUpdateStatus(record.id, "pending")}>
          <ReceiptText className="size-4" />
          Mark Pending
        </Button>
        <Button variant="outline" size="sm" className="min-h-10" onClick={() => onUpdateAmount(record.id)}>
          <Edit3 className="size-4" />
          Edit Amount
        </Button>
      </div>
    </article>
  );
}

function TuitionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof UserRound;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#eef6ff_52%,#ffffff)] p-5 shadow-xl shadow-sky-200/35 sm:p-6">
      <div className="absolute right-5 top-5 size-20 rounded-[28px] bg-white/60 shadow-lg shadow-sky-200/35" />
      <div className="relative flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/82 text-sky-700">
          <Icon className="size-6" />
        </div>
        <div>
          <Badge variant="info" className="mb-3">{eyebrow}</Badge>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Bell; tone: string }) {
  return (
    <div className="rounded-2xl bg-sky-50/80 p-4">
      <div className={cn("mb-2 flex items-center gap-2 text-sm font-semibold", tone)}>
        <Icon className="size-4" />
        {label}
      </div>
      <p className="font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function AdminSummary({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="sunny-card rounded-[24px] p-4">
      <p className={cn("text-3xl font-bold", tone)}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function getStatusMeta(status: TuitionStatus) {
  if (status === "paid") {
    return {
      label: "Paid",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
      textClass: "text-emerald-700",
      badgeVariant: "success" as const,
    };
  }

  if (status === "overdue") {
    return {
      label: "Overdue",
      icon: XCircle,
      iconClass: "bg-rose-50 text-rose-600",
      textClass: "text-rose-700",
      badgeVariant: "outline" as const,
    };
  }

  return {
    label: "Pending",
    icon: Bell,
    iconClass: "bg-amber-50 text-amber-600",
    textClass: "text-amber-700",
    badgeVariant: "warning" as const,
  };
}
