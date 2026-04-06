"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-foreground animate-spin mb-4" />
      <p className="text-muted-foreground text-sm font-body italic">{message}</p>
    </div>
  );
}
