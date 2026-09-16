"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Sembunyikan sandi" : "Tampilkan sandi"}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
            <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.4 5.5A9.9 9.9 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1 2.2-2 3.2M6.2 6.2C4.3 7.5 2.9 9.3 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
