"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-foreground text-foreground placeholder:text-muted-foreground placeholder:italic focus:outline-none focus:border-b-[4px]",
            error && "border-foreground",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-mono mt-1 text-foreground">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
