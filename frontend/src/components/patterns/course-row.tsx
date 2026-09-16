import type { ReactNode } from "react";

export function CourseRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-heading text-lg text-foreground">{title}</h2>
      <div className="mt-3 flex snap-x gap-4 overflow-x-auto pb-2">{children}</div>
    </div>
  );
}
