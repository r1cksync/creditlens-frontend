"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { analysis } from "@/lib/api";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getRatingColor, timeAgo } from "@/lib/utils";

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 20;

  useEffect(() => {
    analysis.history(skip, limit).then((res) => {
      setItems(res.data?.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [skip]);

  if (loading) return <LoadingSpinner message="Loading history..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground font-body mt-1">View all past credit analyses</p>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Company</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Risk Score</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-border-light hover:bg-muted transition-colors duration-100">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/analysis/${item.id}`} className="text-foreground underline hover:no-underline font-medium">
                      {item.company_name}
                    </Link>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                  <td className={`py-3 px-4 font-bold font-mono ${getRatingColor(item.credit_rating || "")}`}>
                    {item.credit_rating || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono">{item.risk_score?.toFixed(1) || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{timeAgo(item.created_at)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-body italic">
                    No analyses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-foreground">
          <button
            onClick={() => setSkip(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="text-sm font-mono uppercase tracking-widest text-foreground hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            Previous
          </button>
          <span className="text-sm font-mono text-muted-foreground">
            Showing {skip + 1}—{skip + items.length}
          </span>
          <button
            onClick={() => setSkip(skip + limit)}
            disabled={items.length < limit}
            className="text-sm font-mono uppercase tracking-widest text-foreground hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}
