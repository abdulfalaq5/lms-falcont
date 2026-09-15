import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-terracotta text-white hover:bg-terracotta/90 shadow-sm shadow-terracotta/20",
  secondary: "bg-teal text-white hover:bg-teal/90 shadow-sm shadow-teal/20",
  ghost: "bg-transparent text-ink hover:bg-cream-deep border border-line",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
