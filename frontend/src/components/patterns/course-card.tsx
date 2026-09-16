import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/lib/api/courses";

export function CourseCard({
  course,
  progress,
  statusLabel,
}: {
  course: Pick<Course, "id" | "title" | "instructor_name" | "category_name">;
  progress?: number;
  statusLabel?: string;
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-md"
    >
      <div className="flex h-32 items-center justify-center bg-primary-soft">
        <span className="font-heading text-3xl text-primary/40">
          {course.title.slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {course.category_name && <Badge variant="outline">{course.category_name}</Badge>}
          {statusLabel && <Badge variant="secondary">{statusLabel}</Badge>}
        </div>
        <h3 className="line-clamp-2 font-heading text-sm text-foreground">{course.title}</h3>
        <p className="text-xs text-muted-foreground">Pengajar: {course.instructor_name ?? "-"}</p>
        {typeof progress === "number" && (
          <div className="mt-auto pt-2">
            <Progress value={progress} className="h-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">{progress}% selesai</p>
          </div>
        )}
      </div>
    </Link>
  );
}
