"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import type { Course } from "@/lib/api/courses";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/patterns/empty-state";

export default function InstrukturCoursesPage() {
  const { user } = useAuth();
  const { data, loading } = useApi<Course[]>(user ? `/courses?instructorId=${user.id}` : null, [user?.id]);

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Kelas Saya" subtitle="Kelas yang sedang kamu ampu." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((course) => (
              <Card key={course.id} className="flex flex-col gap-2 px-5">
                <Badge variant="secondary" className="w-fit capitalize">
                  {course.status}
                </Badge>
                <h2 className="font-heading text-base text-foreground">{course.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                <Link href={`/dashboard/instruktur/courses/${course.id}`}>
                  <Button variant="outline" className="mt-2 w-full">
                    Kelola Kelas
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada kelas" description="Anda belum ditugaskan mengampu kelas apapun." />
        )}
      </div>
    </div>
  );
}
