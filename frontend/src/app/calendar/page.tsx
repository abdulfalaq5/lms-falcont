"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface ScheduleItem {
  id: string;
  title: string;
  type: "session" | "deadline";
  start_time: string;
  end_time: string | null;
  course_title: string;
}

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading } = useApi<ScheduleItem[]>("/schedules/calendar");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const grouped = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, ScheduleItem[]>();
    for (const item of data) {
      const dateKey = new Date(item.start_time).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    }
    return Array.from(map.entries());
  }, [data]);

  if (authLoading || !user) {
    return <div className="flex flex-1 items-center justify-center text-ink-soft">Memuat...</div>;
  }

  return (
    <div className="flex flex-1">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar title="Kalender Kelas" subtitle="Sesi live dan deadline dalam satu tampilan." />
        <div className="flex flex-1 flex-col gap-6 p-6">
          {loading ? (
            <p className="text-sm text-ink-soft">Memuat jadwal...</p>
          ) : grouped.length > 0 ? (
            grouped.map(([date, items]) => (
              <div key={date}>
                <h2 className="font-heading text-base text-ink">{date}</h2>
                <div className="mt-2 flex flex-col gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink">{item.title}</p>
                        <p className="text-xs text-ink-soft">{item.course_title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-ink-soft">
                          {new Date(item.start_time).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <Badge tone={item.type === "session" ? "blue" : "terracotta"}>
                          {item.type === "session" ? "Sesi Live" : "Deadline"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Belum ada jadwal" description="Sesi live dan deadline akan muncul di sini." />
          )}
        </div>
      </div>
    </div>
  );
}
