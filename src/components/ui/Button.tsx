"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground transition-colors duration-100",
      secondary:
        "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-colors duration-100",
      danger:
        "bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground transition-colors duration-100",
      ghost:
        "bg-transparent text-foreground hover:underline transition-none",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-4 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-widest focus-visible:outline focus-visible:outline-3 focus-visible:outline-foreground focus-visible:outline-offset-3 disabled:opacity-40 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
