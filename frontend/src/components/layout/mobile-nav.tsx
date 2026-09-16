"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Role, ROLE_HOME } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavList, SidebarFooter } from "@/components/layout/sidebar";

export function MobileNav({ role }: { role: Role }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col px-4 py-6">
        <SheetHeader className="p-0">
          <SheetTitle asChild>
            <Link href={ROLE_HOME[role]} className="font-heading text-lg text-primary" onClick={() => setOpen(false)}>
              Kelas Kita
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-1 flex-col">
          <NavList role={role} onNavigate={() => setOpen(false)} />
          <SidebarFooter />
        </div>
      </SheetContent>
    </Sheet>
  );
}
