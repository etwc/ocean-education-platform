"use client";

import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/auth/permissions";
import { useDemoRole } from "@/hooks/use-demo-role";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  phase: string;
};

export function ModulePlaceholder({ eyebrow, title, description, icon: Icon, highlights, phase }: ModulePlaceholderProps) {
  const { role } = useDemoRole("student");

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-xl border border-sky-100 bg-[linear-gradient(135deg,#dff6ff,#ffffff_58%,#eef2ff)] p-6 shadow-xl shadow-sky-200/30 sm:p-8">
        <div className="absolute right-8 top-8 hidden size-24 rounded-full bg-white/62 shadow-lg shadow-sky-200/35 sm:block" />
        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge variant="info">{phase}</Badge>
              <Badge variant="success">{roleLabels[role]} view</Badge>
            </div>
            <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Icon className="size-7" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase text-sky-700">{eyebrow}</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 text-balance sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
            <Button variant="premium" className="mt-7">
              Continue build
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div key={highlight} className="rounded-xl border border-sky-100 bg-white/72 p-5 shadow-lg shadow-sky-100 backdrop-blur-xl">
                <Sparkles className="mb-4 size-5 text-sky-600" />
                <p className="text-sm font-semibold leading-6 text-slate-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
