import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes } from "react";

export const Label = ({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`text-sm font-medium text-ink-soft ${className}`} {...props} />
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 ${className}`}
      {...props}
    />
  ),
);
Input.displayName = "Input";
