"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/lib/api";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Activity, Brain, Database, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const [agentData, setAgentData] = useState<any[]>([]);
  const [kbData, setKbData] = useState<any>(null);
  const [groqData, setGroqData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analytics.agents().catch(() => ({ data: { agents: [] } })),
      analytics.kbHealth().catch(() => ({ data: null })),
      analytics.groqUsage().catch(() => ({ data: { usage: [] } })),
    ]).then(([agentsRes, kbRes, groqRes]) => {
      setAgentData(agentsRes.data?.agents || []);
      setKbData(kbRes.data);
      setGroqData(groqRes.data?.usage || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground font-body mt-1">Platform performance and health metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><Brain size={20} strokeWidth={1.5} className="inline mr-2" />Agent Performance</CardTitle>
        </CardHeader>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="_id" tick={{ fill: "#525252", fontFamily: "'JetBrains Mono'", fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: "#525252", fontFamily: "'JetBrains Mono'", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "2px solid #000000", borderRadius: "0px", fontFamily: "'Source Serif 4'" }} />
              <Bar dataKey="avg_duration" fill="#000000" name="Avg Duration (s)" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Agent</th>
                <th className="text-right py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Runs</th>
                <th className="text-right py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Avg Duration</th>
                <th className="text-right py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {agentData.map((a: any) => (
                <tr key={a._id} className="border-b border-border-light">
                  <td className="py-2 px-2 capitalize">{a._id?.replace(/_/g, " ")}</td>
                  <td className="py-2 px-2 text-right font-mono">{a.total_runs}</td>
                  <td className="py-2 px-2 text-right font-mono">{a.avg_duration?.toFixed(2)}s</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">
                    {a.success_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle><Database size={20} strokeWidth={1.5} className="inline mr-2" />Knowledge Base</CardTitle>
          </CardHeader>
          {kbData ? (
            <div className="grid grid-cols-2 gap-0 border border-foreground">
              <div className="p-3 border-r border-b border-foreground">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Documents</p>
                <p className="text-xl font-display font-bold">{kbData.kb_stats?.total_documents || 0}</p>
              </div>
              <div className="p-3 border-b border-foreground">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Chunks</p>
                <p className="text-xl font-display font-bold">{kbData.kb_stats?.total_chunks || 0}</p>
              </div>
              <div className="p-3 border-r border-foreground">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Index Size</p>
                <p className="text-xl font-display font-bold">{kbData.opensearch_stats?.index_size || "N/A"}</p>
              </div>
              <div className="p-3">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Last Updated</p>
                <p className="text-sm font-body font-medium">{kbData.kb_stats?.last_updated || "Never"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 font-body italic">No KB data available</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Zap size={20} strokeWidth={1.5} className="inline mr-2" />Groq API Usage</CardTitle>
          </CardHeader>
          {groqData.length > 0 ? (
            <div className="space-y-4">
              {groqData.map((model: any) => (
                <div key={model._id} className="p-3 border border-foreground">
                  <p className="text-sm font-mono font-medium mb-2">{model._id}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div>
                      <span className="text-muted-foreground font-mono uppercase tracking-widest">Calls:</span>
                      <span className="ml-1 font-medium">{model.total_calls}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono uppercase tracking-widest">Latency:</span>
                      <span className="ml-1 font-medium">{model.avg_latency_ms?.toFixed(0)}ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono uppercase tracking-widest">Prompt:</span>
                      <span className="ml-1 font-medium">{model.total_prompt_tokens?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-mono uppercase tracking-widest">Completion:</span>
                      <span className="ml-1 font-medium">{model.total_completion_tokens?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 font-body italic">No usage data yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
