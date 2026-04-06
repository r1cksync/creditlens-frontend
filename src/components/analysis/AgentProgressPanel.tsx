"use client";

import { AgentProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Brain, Calculator, Shield, TrendingUp, BarChart3,
  FileSearch, AlertTriangle, MessageSquare, CheckCircle2,
  XCircle, Clock, Loader2, Eye, BookOpen, LineChart,
  Fingerprint, PieChart, Activity,
} from "lucide-react";

const agentIcons: Record<string, any> = {
  supervisor: Brain,
  financial_metrics: Calculator,
  risk_assessor: Shield,
  compliance_checker: CheckCircle2,
  forecasting_simulation: TrendingUp,
  benchmarking_statistics: BarChart3,
  document_intelligence: FileSearch,
  fraud_signal: AlertTriangle,
  ask_user_question: MessageSquare,
  critic_verifier: Eye,
  report_synthesizer: BookOpen,
  crag_retriever: LineChart,
  qrag_optimizer: Activity,
  knowledge_monitor: Clock,
  knowledge_curator: BookOpen,
  sentiment_macro: TrendingUp,
  portfolio_risk: PieChart,
  dashboard_analytics: BarChart3,
};

const statusConfig = {
  pending: { color: "text-muted-foreground", bg: "bg-muted", icon: Clock },
  running: { color: "text-foreground", bg: "bg-muted", icon: Loader2 },
  completed: { color: "text-foreground", bg: "bg-background", icon: CheckCircle2 },
  error: { color: "text-foreground", bg: "bg-muted", icon: XCircle },
  skipped: { color: "text-muted-foreground", bg: "bg-muted", icon: Clock },
};

interface AgentProgressPanelProps {
  agents: AgentProgress[];
}

export default function AgentProgressPanel({ agents }: AgentProgressPanelProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Agent Progress</h3>
      {agents.map((agent, i) => {
        const cfg = statusConfig[agent.status] || statusConfig.pending;
        const Icon = agentIcons[agent.agent_name] || Brain;
        const StatusIcon = cfg.icon;

        return (
          <div
            key={agent.agent_name}
            className={cn(
              "flex items-center gap-3 px-3 py-2 border border-border-light transition-colors duration-100",
              agent.status === "completed" && "border-foreground",
              agent.status === "running" && "bg-foreground text-background"
            )}
          >
            <Icon size={16} strokeWidth={1.5} className={cn(agent.status === "running" ? "text-background" : cfg.color)} />
            <span className="text-sm flex-1 capitalize font-body">
              {agent.agent_name.replace(/_/g, " ")}
            </span>
            <StatusIcon
              size={16}
              strokeWidth={1.5}
              className={cn(
                agent.status === "running" ? "text-background animate-spin" : cfg.color
              )}
            />
            {agent.duration_seconds && (
              <span className="text-xs font-mono text-muted-foreground">{agent.duration_seconds.toFixed(1)}s</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
