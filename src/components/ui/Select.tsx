"use client";

import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-foreground text-foreground focus:outline-none focus:border-b-[4px] appearance-none cursor-pointer",
            error && "border-foreground",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-mono mt-1 text-foreground">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
