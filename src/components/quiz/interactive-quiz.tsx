"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Flame,
  Medal,
  Play,
  RefreshCcw,
  Sparkles,
  Star,
  Trophy,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemoRole } from "@/hooks/use-demo-role";

type QuizQuestion = {
  prompt: string;
  subject: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
};

type QuizPhase = "start" | "playing" | "feedback" | "result";
type SelectedAnswer = number | "timeout" | null;

const questionTime = 15;

const questions: QuizQuestion[] = [
  {
    subject: "English",
    prompt: "Which sentence uses the correct past tense?",
    choices: ["She go to class yesterday.", "She went to class yesterday.", "She going to class yesterday.", "She goes yesterday class."],
    correctIndex: 1,
    explanation: "Went is the past tense of go.",
    xp: 120,
  },
  {
    subject: "Math",
    prompt: "If 8 students share 32 pencils equally, how many pencils does each student get?",
    choices: ["3", "4", "6", "8"],
    correctIndex: 1,
    explanation: "32 divided by 8 equals 4.",
    xp: 140,
  },
  {
    subject: "Science",
    prompt: "What do plants need to make food through photosynthesis?",
    choices: ["Moonlight and salt", "Sunlight, water, and carbon dioxide", "Sand and oxygen only", "Sound and soil only"],
    correctIndex: 1,
    explanation: "Plants use sunlight, water, and carbon dioxide to make food.",
    xp: 150,
  },
  {
    subject: "BM",
    prompt: "Apakah maksud perkataan rajin?",
    choices: ["Malas", "Suka berusaha", "Cepat marah", "Tidak hadir"],
    correctIndex: 1,
    explanation: "Rajin bermaksud suka berusaha dan tekun.",
    xp: 130,
  },
];

const leaderboardBase = [
  { name: "Aisyah", xp: 1280 },
  { name: "Daniel", xp: 1160 },
  { name: "Mei Lin", xp: 1080 },
  { name: "Arjun", xp: 960 },
];

export function InteractiveQuiz() {
  const { role } = useDemoRole("student");
  const [phase, setPhase] = useState<QuizPhase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<SelectedAnswer>(null);
  const [timeLeft, setTimeLeft] = useState(questionTime);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showXp, setShowXp] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + (phase === "result" ? 1 : 0)) / questions.length) * 100;
  const isCorrect = typeof selectedAnswer === "number" && selectedAnswer === currentQuestion.correctIndex;
  const finalPercent = Math.round((score / questions.length) * 100);
  const leaderboard = useMemo(
    () =>
      [...leaderboardBase, { name: role === "student" ? "You" : "Ocean Demo", xp: 900 + xp }]
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 5),
    [role, xp],
  );

  const settleAnswer = useCallback(
    (answer: SelectedAnswer) => {
      if (phase !== "playing" || selectedAnswer !== null) {
        return;
      }

      const correct = typeof answer === "number" && answer === currentQuestion.correctIndex;

      setSelectedAnswer(answer);
      setPhase("feedback");

      if (correct) {
        setScore((value) => value + 1);
        setXp((value) => value + currentQuestion.xp);
        setStreak((value) => value + 1);
        setShowXp(true);
        window.setTimeout(() => setShowXp(false), 900);
      } else {
        setStreak(0);
      }

      window.setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          setPhase("result");
          return;
        }

        setCurrentIndex((value) => value + 1);
        setSelectedAnswer(null);
        setTimeLeft(questionTime);
        setPhase("playing");
      }, 1500);
    },
    [currentIndex, currentQuestion, phase, selectedAnswer],
  );

  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    if (timeLeft <= 0) {
      settleAnswer("timeout");
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [phase, settleAnswer, timeLeft]);

  function startQuiz() {
    setPhase("playing");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(questionTime);
    setScore(0);
    setXp(0);
    setStreak(0);
    setShowXp(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-sky-100 bg-[linear-gradient(135deg,#e0f7ff,#f8fbff_48%,#eef2ff)] p-5 shadow-xl shadow-sky-200/30 sm:p-7">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-10 top-8 hidden size-20 rounded-3xl bg-white/62 shadow-lg shadow-sky-200/35 sm:block"
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="info" className="mb-4 gap-1.5">
              <Trophy className="size-3.5" />
              Showcase feature
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">Quiz Quest</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              A playful, timed revision experience with instant feedback, XP rewards, streaks, and a demo leaderboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
            <QuizStat icon={Star} label="XP" value={xp.toString()} />
            <QuizStat icon={CheckCircle2} label="Score" value={`${score}/${questions.length}`} />
            <QuizStat icon={Flame} label="Streak" value={streak.toString()} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="sunny-card relative min-h-[560px] overflow-hidden rounded-xl p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {phase === "start" ? <StartScreen onStart={startQuiz} /> : null}
            {phase === "playing" || phase === "feedback" ? (
              <QuestionScreen
                key={currentQuestion.prompt}
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                timeLeft={timeLeft}
                progress={progress}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                phase={phase}
                onAnswer={settleAnswer}
                showXp={showXp}
              />
            ) : null}
            {phase === "result" ? (
              <ResultScreen
                score={score}
                total={questions.length}
                xp={xp}
                finalPercent={finalPercent}
                onRetry={startQuiz}
              />
            ) : null}
          </AnimatePresence>
        </section>

        <aside className="space-y-4">
          <div className="sunny-card rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Leaderboard</h2>
                <p className="text-sm text-slate-500">Demo classroom ranking</p>
              </div>
              <Medal className="size-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {leaderboard.map((student, index) => (
                <motion.div
                  key={student.name}
                  layout
                  className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white/72 p-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.xp} XP</p>
                  </div>
                  {student.name === "You" || student.name === "Ocean Demo" ? <Badge variant="success">You</Badge> : null}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/72 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-800">
              <Sparkles className="size-4" />
              Reward rules
            </div>
            <div className="space-y-3 text-sm text-indigo-700">
              <p>Correct answers give XP immediately.</p>
              <p>Fast streaks make the experience feel motivating.</p>
              <p>Retry keeps practice low-pressure.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function QuizStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/72 p-4 shadow-lg shadow-sky-200/25">
      <Icon className="mb-3 size-5 text-sky-600" />
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex min-h-[510px] flex-col items-center justify-center text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-xl shadow-blue-200"
      >
        <Trophy className="size-12" />
      </motion.div>
      <Badge variant="warning" className="mb-4">
        4 questions · timed
      </Badge>
      <h2 className="max-w-xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">Ready for a quick learning sprint?</h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
        Answer before the timer ends, earn XP, and climb the leaderboard.
      </p>
      <Button variant="premium" size="lg" className="mt-8" onClick={onStart}>
        <Play className="size-5" />
        Start Quiz
      </Button>
    </motion.div>
  );
}

function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  progress,
  selectedAnswer,
  isCorrect,
  phase,
  onAnswer,
  showXp,
}: {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  progress: number;
  selectedAnswer: SelectedAnswer;
  isCorrect: boolean;
  phase: QuizPhase;
  onAnswer: (answer: SelectedAnswer) => void;
  showXp: boolean;
}) {
  return (
    <motion.div
      key={question.prompt}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.32 }}
      className="relative"
    >
      <AnimatePresence>
        {showXp ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: -44, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            className="absolute right-4 top-12 z-10 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-white shadow-xl shadow-amber-200"
          >
            +{question.xp} XP
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="info">{question.subject}</Badge>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <Clock3 className="size-4 text-sky-600" />
            {timeLeft}s
          </div>
          <div className="rounded-full border border-sky-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            {questionNumber}/{totalQuestions}
          </div>
        </div>
      </div>

      <Progress value={progress} className="mb-8 bg-sky-100" />

      <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-4xl">{question.prompt}</h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {question.choices.map((choice, index) => {
          const isSelected = selectedAnswer === index;
          const isAnswerCorrect = index === question.correctIndex;
          const reveal = phase === "feedback";

          return (
            <motion.button
              key={choice}
              type="button"
              whileHover={selectedAnswer === null ? { y: -4, scale: 1.01 } : undefined}
              whileTap={selectedAnswer === null ? { scale: 0.98 } : undefined}
              onClick={() => onAnswer(index)}
              disabled={selectedAnswer !== null}
              className={[
                "min-h-24 rounded-xl border p-5 text-left text-base font-semibold shadow-sm transition-all",
                "bg-white text-slate-800 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100",
                reveal && isAnswerCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-sky-100",
                reveal && isSelected && !isAnswerCorrect ? "border-rose-300 bg-rose-50 text-rose-800" : "",
              ].join(" ")}
            >
              <span className="mb-3 flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">
                {String.fromCharCode(65 + index)}
              </span>
              {choice}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {phase === "feedback" ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={[
              "mt-6 rounded-xl border p-4",
              isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800",
            ].join(" ")}
          >
            <div className="mb-2 flex items-center gap-2 font-semibold">
              {isCorrect ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
              {isCorrect ? "Correct. Nice work." : selectedAnswer === "timeout" ? "Time is up." : "Not quite yet."}
            </div>
            <p className="text-sm leading-6">{question.explanation}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultScreen({
  score,
  total,
  xp,
  finalPercent,
  onRetry,
}: {
  score: number;
  total: number;
  xp: number;
  finalPercent: number;
  onRetry: () => void;
}) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex min-h-[510px] flex-col items-center justify-center text-center"
    >
      <div className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 to-sky-500 text-white shadow-xl shadow-sky-200">
        <Medal className="size-12" />
      </div>
      <Badge variant={finalPercent >= 75 ? "success" : "warning"} className="mb-4">
        Quiz complete
      </Badge>
      <h2 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-6xl">{finalPercent}%</h2>
      <p className="mt-3 text-base text-slate-600">
        You scored {score}/{total} and earned {xp} XP.
      </p>
      <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-3">
        <ResultPill label="Score" value={`${score}/${total}`} />
        <ResultPill label="XP" value={xp.toString()} />
        <ResultPill label="Badge" value={finalPercent >= 75 ? "Bright Star" : "Keep Going"} />
      </div>
      <Button variant="premium" size="lg" className="mt-8" onClick={onRetry}>
        <RefreshCcw className="size-5" />
        Retry Quiz
      </Button>
    </motion.div>
  );
}

function ResultPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sky-100 bg-white/78 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
