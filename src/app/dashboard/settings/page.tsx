"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/api";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Database, Bell, Shield, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      admin.getCreditPolicies().catch(() => ({ data: { policies: [] } })),
      admin.getRegulatoryAlerts(0, 10).catch(() => ({ data: { alerts: [] } })),
      admin.getAuditLogs(0, 20).catch(() => ({ data: { logs: [] } })),
    ]).then(([polRes, alertRes, logRes]) => {
      setPolicies(polRes.data?.policies || []);
      setAlerts(alertRes.data?.alerts || []);
      setAuditLogs(logRes.data?.logs || []);
      setLoading(false);
    });
  }, []);

  const triggerKbUpdate = async () => {
    try {
      await admin.triggerKbUpdate();
      toast.success("Knowledge base update triggered");
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger update");
    }
  };

  if (loading) return <LoadingSpinner message="Loading settings..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground font-body mt-1">System configuration and administration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground">
        <div className="p-6 border-r border-foreground">
          <div className="flex items-center gap-3 mb-3">
            <Database size={20} strokeWidth={1.5} />
            <span className="font-display font-semibold">Knowledge Base</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Manually trigger a knowledge base update to fetch latest regulatory data
          </p>
          <Button size="sm" onClick={triggerKbUpdate}>
            <RefreshCw size={14} strokeWidth={1.5} /> Trigger Update
          </Button>
        </div>

        <div className="p-6 border-r border-foreground">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={20} strokeWidth={1.5} />
            <span className="font-display font-semibold">Credit Policies</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-4">
            {policies.length} active credit policies configured
          </p>
          <Button size="sm" variant="secondary">Manage Policies</Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Bell size={20} strokeWidth={1.5} />
            <span className="font-display font-semibold">Regulatory Alerts</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-4">
            {alerts.length} recent regulatory alerts
          </p>
          <Button size="sm" variant="secondary">View Alerts</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Regulatory Alerts</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {alerts.length > 0 ? alerts.map((alert: any, i: number) => (
            <div key={i} className="p-3 border border-border-light">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{alert.title || "Alert"}</span>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{alert.source || "RBI"}</span>
              </div>
              <p className="text-xs text-muted-foreground font-body">{alert.summary || alert.description || ""}</p>
            </div>
          )) : (
            <p className="text-muted-foreground text-center py-4 font-body italic">No alerts</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Action</th>
                <th className="text-left py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">User</th>
                <th className="text-left py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Details</th>
                <th className="text-left py-2 px-2 font-mono uppercase tracking-widest text-muted-foreground">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log: any, i: number) => (
                <tr key={i} className="border-b border-border-light">
                  <td className="py-2 px-2 capitalize">{log.action?.replace(/_/g, " ")}</td>
                  <td className="py-2 px-2 text-muted-foreground font-mono">{log.user_id || "system"}</td>
                  <td className="py-2 px-2 text-muted-foreground max-w-xs truncate font-mono">
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground font-mono">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
