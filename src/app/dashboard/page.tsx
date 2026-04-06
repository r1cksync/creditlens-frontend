"use client";

import { useEffect, useState } from "react";
import { analytics, analysis } from "@/lib/api";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { timeAgo, getRatingColor } from "@/lib/utils";
import {
  Brain, FileText, Users, CheckCircle2, Clock, Activity,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analytics.dashboard().catch(() => ({ data: null })),
      analysis.history(0, 5).catch(() => ({ data: { items: [] } })),
    ]).then(([dashRes, histRes]) => {
      setData(dashRes.data);
      setHistory(histRes.data?.items || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const stats = [
    { label: "Total Analyses", value: data?.total_analyses || 0, icon: Brain },
    { label: "Completed", value: data?.completed_analyses || 0, icon: CheckCircle2 },
    { label: "In Progress", value: data?.in_progress_analyses || 0, icon: Clock },
    { label: "Success Rate", value: `${data?.success_rate || 0}%`, icon: Activity },
    { label: "Total Users", value: data?.total_users || 0, icon: Users },
    { label: "Documents", value: data?.total_documents || 0, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Overview of your credit analysis platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-foreground">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 border border-foreground group hover:bg-foreground hover:text-background transition-colors duration-100">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} strokeWidth={1.5} />
              <span className="text-xs font-mono uppercase tracking-widest opacity-60">{stat.label}</span>
            </div>
            <p className="text-2xl font-display font-bold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Analyses */}
      <Card padding={false}>
        <div className="p-6 border-b border-foreground flex items-center justify-between">
          <h3 className="text-lg font-display font-semibold tracking-tight">Recent Analyses</h3>
          <Link href="/dashboard/history" className="text-sm font-body text-foreground underline hover:no-underline">
            View All
          </Link>
        </div>
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
              {history.map((item: any) => (
                <tr key={item.id} className="border-b border-border-light hover:bg-muted transition-colors duration-100">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/analysis/${item.id}`} className="hover:underline font-medium">
                      {item.company_name}
                    </Link>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                  <td className={`py-3 px-4 font-display font-bold ${getRatingColor(item.credit_rating || "")}`}>
                    {item.credit_rating || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{item.risk_score?.toFixed(1) || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{timeAgo(item.created_at)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-body italic">
                    No analyses yet.{" "}
                    <Link href="/dashboard/analysis/new" className="text-foreground underline">
                      Start your first analysis
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
