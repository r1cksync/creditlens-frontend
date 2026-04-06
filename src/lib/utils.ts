import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "INR"): string {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  }
  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getRatingColor(rating: string): string {
  const high = ["AAA", "AA", "A"];
  const mid = ["BBB", "BB"];
  if (high.includes(rating)) return "text-foreground";
  if (mid.includes(rating)) return "text-foreground";
  return "text-muted-foreground";
}

export function getRiskColor(score: number): string {
  if (score < 50) return "text-foreground";
  return "text-muted-foreground";
}

export function getStatusColor(status: string): string {
  const active: Record<string, string> = {
    completed: "text-foreground",
    in_progress: "text-foreground",
    failed: "text-muted-foreground",
    waiting_user_input: "text-muted-foreground",
    approved: "text-foreground",
    rejected: "text-muted-foreground",
    under_review: "text-muted-foreground",
  };
  return active[status] || "text-muted-foreground";
}

export function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    completed: "bg-foreground text-background border-foreground",
    in_progress: "bg-background text-foreground border-foreground",
    failed: "bg-muted text-muted-foreground border-border-light",
    waiting_user_input: "bg-background text-foreground border-border-light",
    approved: "bg-foreground text-background border-foreground",
    rejected: "bg-muted text-muted-foreground border-border-light",
    under_review: "bg-background text-foreground border-foreground",
  };
  return badges[status] || "bg-muted text-muted-foreground border-border-light";
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN");
}
