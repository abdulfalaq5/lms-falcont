type BadgeTone = "terracotta" | "teal" | "plum" | "blue" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  terracotta: "bg-terracotta-soft text-terracotta",
  teal: "bg-teal-soft text-teal",
  plum: "bg-plum-soft text-plum",
  blue: "bg-blue-soft text-blue",
  neutral: "bg-cream-deep text-ink-soft",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export const ENROLLMENT_STATUS_TONE: Record<string, BadgeTone> = {
  pending: "plum",
  approved: "blue",
  active: "teal",
  completed: "terracotta",
  dropped: "neutral",
};

export const ENROLLMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Persetujuan",
  approved: "Disetujui",
  active: "Aktif",
  completed: "Selesai",
  dropped: "Berhenti",
};
