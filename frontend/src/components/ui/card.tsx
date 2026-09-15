import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-5 ${className}`}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "terracotta",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "terracotta" | "teal" | "plum" | "blue";
}) {
  const accentClass = {
    terracotta: "text-terracotta",
    teal: "text-teal",
    plum: "text-plum",
    blue: "text-blue",
  }[accent];

  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className={`font-heading text-3xl ${accentClass}`}>{value}</span>
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </Card>
  );
}
