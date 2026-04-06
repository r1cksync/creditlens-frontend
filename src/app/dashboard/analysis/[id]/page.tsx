"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { analysis } from "@/lib/api";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AgentProgressPanel from "@/components/analysis/AgentProgressPanel";
import ReportView from "@/components/analysis/ReportView";
import { AgentProgress, CreditReport } from "@/lib/types";
import toast from "react-hot-toast";
import { Download, MessageSquare } from "lucide-react";

export default function AnalysisDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [status, setStatus] = useState<string>("in_progress");
  const [agents, setAgents] = useState<AgentProgress[]>([]);
  const [report, setReport] = useState<CreditReport | null>(null);
  const [question, setQuestion] = useState<any>(null);
  const [userResponse, setUserResponse] = useState("");
  const [loading, setLoading] = useState(true);

  const pollStatus = useCallback(async () => {
    try {
      const res = await analysis.getStatus(sessionId);
      const data = res.data;
      setStatus(data.status);
      setAgents(data.agent_progress || []);
      setLoading(false);

      if (data.status === "completed") {
        const reportRes = await analysis.getReport(sessionId);
        setReport(reportRes.data);
      }
    } catch {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    pollStatus();
    const interval = setInterval(() => {
      if (status === "in_progress" || status === "waiting_user_input") {
        pollStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pollStatus, status]);

  useEffect(() => {
    const url = analysis.streamUrl(sessionId);
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "status") setStatus(data.status);
        if (data.type === "progress") setAgents(data.agents || []);
        if (data.type === "ask_user") setQuestion(data.question);
        if (data.type === "complete") {
          setReport(data.report);
          setStatus("completed");
        }
        if (data.type === "error") {
          setStatus("failed");
          toast.error(data.message);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
      };
    } catch {
      // SSE not supported or failed, fall back to polling
    }

    return () => eventSource?.close();
  }, [sessionId]);

  const handleRespond = async () => {
    if (!question || !userResponse.trim()) return;
    try {
      await analysis.respond(sessionId, {
        question_id: question.question_id,
        response: userResponse,
      });
      setQuestion(null);
      setUserResponse("");
      toast.success("Response submitted");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit response");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await analysis.getReportPdf(sessionId);
      window.open(res.data.pdf_url, "_blank");
    } catch {
      toast.error("PDF not available yet");
    }
  };

  if (loading) return <LoadingSpinner message="Loading analysis..." />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Credit Analysis</h1>
          <p className="text-muted-foreground font-mono text-xs mt-1">Session: {sessionId}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          {status === "completed" && (
            <Button variant="secondary" size="sm" onClick={handleDownloadPdf}>
              <Download size={16} strokeWidth={1.5} />
              PDF Report
            </Button>
          )}
        </div>
      </div>

      {(status === "in_progress" || status === "waiting_user_input") && (
        <Card>
          <AgentProgressPanel agents={agents} />
        </Card>
      )}

      {question && status === "waiting_user_input" && (
        <Card className="border-2 border-foreground">
          <div className="flex items-start gap-3">
            <MessageSquare size={20} strokeWidth={1.5} className="mt-0.5" />
            <div className="flex-1">
              <p className="font-display font-semibold mb-2">Agent Question</p>
              <p className="text-muted-foreground font-body mb-4">{question.question}</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your response..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleRespond}>Submit</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {report && status === "completed" && <ReportView report={report} />}

      {status === "failed" && (
        <Card className="border-2 border-foreground text-center py-12">
          <p className="text-lg font-display font-semibold mb-2">Analysis Failed</p>
          <p className="text-muted-foreground font-body">An error occurred during processing. Please try again.</p>
        </Card>
      )}
    </div>
  );
}
