"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { ROLE_LABELS, useAuth } from "@/lib/auth-context";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-5 sm:px-6">
      <div className="flex items-center gap-2">
        {user && <MobileNav role={user.role} />}
        <div>
          <h1 className="font-heading text-xl text-foreground sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full outline-none md:flex">
            <Avatar>
              <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
