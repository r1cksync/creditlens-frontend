"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  inverted?: boolean;
}

export default function Card({ children, className, padding = true, inverted = false }: CardProps) {
  return (
    <div
      className={cn(
        "border border-foreground",
        inverted ? "bg-foreground text-background" : "bg-background text-foreground",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-4 pb-4 border-b border-foreground", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-display font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}
