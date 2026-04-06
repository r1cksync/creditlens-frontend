"use client";

import { cn, getStatusBadge } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: BadgeProps) {
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-widest border",
        getStatusBadge(status),
        className
      )}
    >
      {label}
    </span>
  );
}
